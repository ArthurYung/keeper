import { fromObject } from './api'
import { parse } from './parser'

export function createKeeper (source: string, config: any = {}) {
  const properties = parse(source)
  const from = fromObject(properties, config)

  return {
    properties,
    config,
    from
  }
}
