import { fromObject, readProperiteValue } from './api'
import { parse } from './parser'
import {
  type KeeperInstance,
  type KeeperConfig,
  type TransferKeeperExtendType,
  type ParseRuleString
} from './type'

export function createKeeper<T extends string, C extends KeeperConfig> (
  source: T,
  config: C
): KeeperInstance<ParseRuleString<T, TransferKeeperExtendType<C>>, C> {
  const properties = parse(source)
  const from = fromObject(properties, config)
  const read = readProperiteValue(properties, config)

  return {
    properties,
    config,
    from,
    read
  }
}
