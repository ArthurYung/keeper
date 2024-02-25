import { fromObject, readProperiteValue } from './api'
import { parse } from './parser'
import { type CreateInstance } from './type'

export const createKeeper: CreateInstance = (source, config = {} as any) => {
  const properties = parse(source as string, config.lazy)
  const from = fromObject(properties, config)
  const read = readProperiteValue(properties, config)

  return {
    properties,
    config,
    from,
    read
  }
}
