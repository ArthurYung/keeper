import { test } from 'vitest'
import { readerMap } from '../reader'
import { SymbolTypeTable } from '../table'

test('BOOL reader should convert truthy and falsy values to boolean', ({
  expect
}) => {
  const boolReader = readerMap.get(SymbolTypeTable.BOOL)
  expect(boolReader?.reader('true')).toBe(true)
  expect(boolReader?.reader('')).toBe(false)
})

test('INT reader should convert values to integer', ({ expect }) => {
  const intReader = readerMap.get(SymbolTypeTable.INT)
  expect(intReader?.reader('123')).toBe(123)
  expect(intReader?.reader('123.45')).toBe(123)
})

test('NULL reader should always return null', ({ expect }) => {
  const nullReader = readerMap.get(SymbolTypeTable.NULL)
  expect(nullReader?.reader('anything')).toBeNull()
})

test('VOID reader should always return undefined', ({ expect }) => {
  const voidReader = readerMap.get(SymbolTypeTable.VOID)
  expect(voidReader?.reader('anything')).toBeUndefined()
})

test('FUNC reader should return a function', ({ expect }) => {
  const funcReader = readerMap.get(SymbolTypeTable.FUNC)
  const func = () => 'test'
  expect(funcReader?.reader(func)).toBe(func)
  expect(funcReader?.reader('test')()).toBe('test')
})

test('FLOAT reader should convert values to float', ({ expect }) => {
  const floatReader = readerMap.get(SymbolTypeTable.FLOAT)
  expect(floatReader?.reader('123.45')).toBe(123.45)
  expect(floatReader?.reader('123')).toBe(123)
})

test('STRING reader should convert values to string', ({ expect }) => {
  const stringReader = readerMap.get(SymbolTypeTable.STRING)
  expect(stringReader?.reader(123)).toBe('123')
  expect(stringReader?.reader(true)).toBe('true')
})

test('OBJECT reader should convert values to object', ({ expect }) => {
  const objectReader = readerMap.get(SymbolTypeTable.OBJECT)
  const obj = { a: 1 }
  expect(objectReader?.reader(obj)).toEqual(obj)
})
