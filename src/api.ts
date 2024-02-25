import { type ProperiteItem, type ProperiteItemMap } from './parser'
import { readerMap } from './reader'
import { type KeeperConfig } from './type'

const RE_PROP_PATH = /[^.[\]]+/g

/**
 * Get the value of the source object based on the property.
 **/
export function getSourceValue (source: any, propertie: ProperiteItem) {
  const sourceValue = source?.[propertie.key]
  if (propertie.isArray) {
    // If the current property type is an array, but the corresponding value in the source object is not,
    // forcefully convert it to an array.
    return Array.isArray(sourceValue)
      ? sourceValue
      : sourceValue === undefined
        ? []
        : [sourceValue]
  }

  return sourceValue
}

/**
 * Get the corresponding reader method registered for the type of an object's attribute.
 **/
function getPropertieReader (
  propertie: ProperiteItem,
  config: KeeperConfig = {}
) {
  if (!propertie.isExtend) {
    return readerMap.get(propertie.type)?.reader
  }

  const extendConfig = config.extends?.[propertie.type]

  if (!extendConfig?.properties) {
    return null
  }

  // If the current property is an extension, the reader method is obtained from the extended configuration.
  return fromObject(extendConfig.properties, extendConfig.config)
}

/**
 * Generate a new secure object from the source object based on the incoming properties map.
 **/
export function fromObject (properties: ProperiteItemMap, config: KeeperConfig) {
  return (source: any) => {
    const result: any = {}
    properties.forEach((propertie) => {
      const reader = getPropertieReader(propertie, config)

      if (!reader) {
        return
      }

      const sourceValue = getSourceValue(source, propertie)

      if (propertie.isArray) {
        result[propertie.name] = sourceValue.map(reader)
      } else {
        result[propertie.name] = reader(sourceValue)
      }
    })

    return result
  }
}

/**
 * Read the value of the source object based on the incoming path.
 *
 * @example
 * read({ a: { b: 1 } }, 'a.b') // 1
 **/
export function readProperiteValue (
  propertie: ProperiteItemMap,
  config: KeeperConfig
) {
  return (obj: any, path: string): any => {
    const stringPath = path.match(RE_PROP_PATH) ?? []

    if (!stringPath.length) {
      throw new Error('readFail: path is empty')
    }

    let activePropertie: ProperiteItemMap | undefined = propertie
    let activeConfig: KeeperConfig | undefined = config
    let currentPropertie: ProperiteItem | undefined
    let currentPath = stringPath.shift()
    let currentValue = obj

    while (currentPath && activePropertie) {
      currentPropertie = activePropertie.get(currentPath)

      if (!currentPropertie) {
        throw new Error(`readFail: path ${currentPath} is not exist`)
      }

      currentValue = getSourceValue(currentValue, currentPropertie)

      if (currentPropertie.isArray) {
        currentPath = stringPath.shift()
        currentValue = currentValue[currentPath ?? 0]
      }

      if (stringPath.length) {
        activePropertie =
          activeConfig?.extends?.[currentPropertie.type].properties
        activeConfig = activeConfig?.extends?.[currentPropertie.type].config
      }

      currentPath = stringPath.shift()
    }

    if (stringPath.length || !currentPropertie) {
      throw new Error(`readFail: path ${stringPath.join('.')} is not exist`)
    }

    const reader = getPropertieReader(currentPropertie, activeConfig)

    if (!reader) {
      throw new Error(
        `readFail: reader of ${currentPropertie.type} is not exist`
      )
    }

    return reader(currentValue)
  }
}
