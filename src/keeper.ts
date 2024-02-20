import { fromObject } from './api'
import { parse } from './parser'
import { type KeeperInstance, type KeeperConfig } from './type'

export function createKeeper<T extends string, C extends KeeperConfig> (
  source: T,
  config: C
): KeeperInstance<T, C> {
  const properties = parse(source)
  const from = fromObject(properties, config)

  return {
    properties,
    config,
    from
  }
}
