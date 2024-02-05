import { type ProperiteItem, type ProperiteItemMap } from './parser'
import { readerMap } from './reader'

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

function getPropertieReader (propertie: ProperiteItem, config: any = {}) {
  if (!propertie.isExtend) {
    return readerMap.get(propertie.type)?.reader
  }

  const extendConfig = config.extends[propertie.type] || {}

  return extendConfig.properties
    ? fromObject(extendConfig.properties, extendConfig.config)
    : null
}

export function fromObject (properties: ProperiteItemMap, config: any) {
  return (source: Object) => {
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
