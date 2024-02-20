import { fromObject } from './api'
import { parse } from './parser'
import { type Keeper, type KeeperConfig } from './type'

export function createKeeper<T extends string, C extends KeeperConfig> (
  source: T,
  config: C
): Keeper<T, C> {
  const properties = parse(source)
  const from = fromObject(properties, config)

  return {
    properties,
    config,
    from
  }
}
