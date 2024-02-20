import { SymbolTypeTable } from './table'

export interface ProperiteReader {
  reader: (source: any) => any
}

export const readerMap = new Map<string, ProperiteReader>()

/*
 * Register reader methods for data type.
 **/

readerMap.set(SymbolTypeTable.BOOL, { reader: (source) => !!source })
readerMap.set(SymbolTypeTable.INT, { reader: (source) => ~~source })
readerMap.set(SymbolTypeTable.NULL, { reader: () => null })
readerMap.set(SymbolTypeTable.VOID, { reader: () => {} })
readerMap.set(SymbolTypeTable.FUNC, {
  reader: (source) => (typeof source === 'function' ? source : () => source)
})
readerMap.set(SymbolTypeTable.FLOAT, {
  reader: (source) => Number(source) || 0
})
readerMap.set(SymbolTypeTable.STRING, {
  reader: (source) => String(source || '')
})
readerMap.set(SymbolTypeTable.OBJECT, { reader: (source) => Object(source) })
