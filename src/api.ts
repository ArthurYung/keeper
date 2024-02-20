import { type ProperiteItem, type ProperiteItemMap } from './parser'
import { readerMap } from './reader'
import { type KeeperConfig } from './type'

export function getSourceValue (source: any, propertie: ProperiteItem) {
  const sourceValue = source[propertie.key]
  if (propertie.isArray) {
    return Array.isArray(sourceValue)
      ? sourceValue
      : sourceValue === undefined
        ? []
        : [sourceValue]
  }

  return sourceValue
}

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

  return fromObject(extendConfig.properties, extendConfig.config)
}

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
        result[propertie.key] = sourceValue.map(reader)
      } else {
        result[propertie.key] = reader(sourceValue)
      }
    })

    return result
  }
}
