const SYMBOL_BOOL = 'bool'
const SYMBOL_INT = 'int'
const SYMBOL_FLOAT = 'float'
const SYMBOL_STRING = 'string'
const SYMBOL_NULL = 'null'
const SYMBOL_UNDEFINED = 'undefined'
const SYMBOL_VOID = 'void'
const SYMBOL_FUNC = 'func'
const SYMBOL_OBJECT = 'object'
const SYMBOL_EXTEND = '*'
const SYMBOL_ARRAY = '[]'

type SYMBOL_BOOL = typeof SYMBOL_BOOL
type SYMBOL_INT = typeof SYMBOL_INT
type SYMBOL_FLOAT = typeof SYMBOL_FLOAT
type SYMBOL_STRING = typeof SYMBOL_STRING
type SYMBOL_NULL = typeof SYMBOL_NULL
type SYMBOL_UNDEFINED = typeof SYMBOL_UNDEFINED
type SYMBOL_VOID = typeof SYMBOL_VOID
type SYMBOL_FUNC = typeof SYMBOL_FUNC
type SYMBOL_OBJECT = typeof SYMBOL_OBJECT
type SYMBOL_EXTEND = typeof SYMBOL_EXTEND
type SYMBOL_ARRAY = typeof SYMBOL_ARRAY

export enum SymbolTypeTable {
  BOOL = SYMBOL_BOOL,
  INT = SYMBOL_INT,
  FLOAT = SYMBOL_FLOAT,
  STRING = SYMBOL_STRING,
  NULL = SYMBOL_NULL,
  UNDEFINED = SYMBOL_UNDEFINED,
  VOID = SYMBOL_VOID,
  FUNC = SYMBOL_FUNC,
  OBJECT = SYMBOL_OBJECT,
  EXTEND = SYMBOL_EXTEND,
  ARRAY = SYMBOL_ARRAY,
}

export interface TypeTransformMap {
  [SYMBOL_INT]: number
  [SYMBOL_FLOAT]: number
  [SYMBOL_STRING]: string
  [SYMBOL_VOID]: any
  [SYMBOL_NULL]: null
  [SYMBOL_BOOL]: boolean
  [SYMBOL_UNDEFINED]: undefined
  [SYMBOL_FUNC]: Function
  [SYMBOL_OBJECT]: Object
}

export enum SymbolExtensionTable {
  RENAME = 'renamefrom',
  COPY = 'copyas',
}

export enum SymbolTokenTable {
  SPACE = ' ',
  BREAK = '\n',
}
