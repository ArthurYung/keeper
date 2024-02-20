import { type ProperiteItem, type ProperiteItemMap } from './parser'
import { readerMap } from './reader'
import { type KeeperConfig } from './type'

/**
 * Get the value of the source object based on the property.
 **/
export function getSourceValue (source: any, propertie: ProperiteItem) {
  const sourceValue = source[propertie.key]
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
