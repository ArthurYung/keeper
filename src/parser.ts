import { type SymbolExtensionTable, SymbolTypeTable } from './table'

export interface ProperiteItem {
  type: string
  key: string
  name: string
  isArray?: boolean
  isExtend?: boolean
}

export type ProperiteItemMap = Map<string, ProperiteItem>

/*
 * Parse the string into an array of tokens based on spaces and line breaks.
 *
 * @example
 * tokenizer(`
 * key1 bool
 * key2 int
 * `)
 * // => [['key1', 'bool'], ['key2', 'int']]
 **/
function tokenizer (input: string = ''): string[][] {
  return input
    .split('\n')
    .map((line) => line.match(/([^\s]+)/g))
    .filter(Boolean) as string[][]
}

/**
 * Compile tokens into a map of properties.
 *
 * Supported extensions:
 * - `renamefrom:name` - Rename the property to the specified name.
 * - `copyas:name` - Copy the property to the specified name.
 *
 * @example
 * compile([['key1', 'bool'], ['key2', 'int', 'renamefrom:source1'], ['key3', 'int', 'copyas:key4')
 * // => Map {
 * //   'key1' => { key: 'key1', type: 'bool', name: 'key1' },
 * //   'key2' => { key: 'key2', type: 'int', name: 'source1' },
 * //  'key3' => { key: 'key3', type: 'int', name: 'key3' },
 * //   'key4' => { key: 'key3', type: 'int', name: 'key4' }
 * // }
 **/
function compile (tokens: string[][]) {
  const properites = new Map<string, ProperiteItem>()
  for (const token of tokens) {
    const properite = parseToken(token)
    const extensions = token[2] ? parseExtension(token[2]) : {}

    // rename the property from the specified name.
    if (extensions.renamefrom) {
      properite.name = extensions.renamefrom
    }

    if (extensions.copyas) {
      // create a new property item and inherit the currently parsed property.
      properites.set(extensions.copyas, {
        ...properite,
        name: extensions.copyas
      })
    }

    properites.set(properite.name, properite)
  }

  return properites
}

function parseType (value: string) {
  let isArray = false
  let isExtend = false
  let type = value || ''
  if (type.endsWith(SymbolTypeTable.ARRAY)) {
    isArray = true
    type = type.substring(0, type.length - 2)
  }

  if (type.startsWith(SymbolTypeTable.EXTEND)) {
    isExtend = true
    type = type.substring(1)
  }

  return {
    isArray,
    isExtend,
    type
  }
}

function parseExtension (extension = '') {
  const extensions: { [x in SymbolExtensionTable]?: string } = {}
  const result = extension.match(/(copyas|renamefrom):(.+)$/)

  if (result) {
    extensions[result[1] as SymbolExtensionTable] = result[2]
  }

  return extensions
}

function parseToken (token: string[]) {
  const key = token[0]
  const { isExtend, isArray, type } = parseType(token[1])

  return {
    key,
    isExtend,
    isArray,
    type,
    name: key
  }
}

/**
 * Parse the input string into a map of properties.
 *
 * supported complex type declarations:
 * - `type[]` - Array of type.
 * - `*type` - Extend from another type.
 *
 * supported extensions:
 * - `renamefrom:name` - Rename the property from the specified name.
 *   - `copyas:name` - Copy the property to the specified name.
 *
 * @example
 * parse(`
 * key1 bool
 * key2 int renamefrom:source1
 * key3 int copyas:key4
 * key5 string[]
 * key6 *other
 * `)
 * // => Map {
 * //   'key1' => { key: 'key1', type: 'bool', name: 'key1' },
 * //   'key2' => { key: 'source1', type: 'int', name: 'key2'},
 * //   'key3' => { key: 'key3', type: 'int', name: 'key3' },
 * //   'key4' => { key: 'key3', type: 'int', name: 'key4' },
 * //   'key5' => { key: 'key5', type: 'string', name: 'key5', isArray: true },
 * //   'key6' => { key: 'key6', type: 'other', name: 'key6', isExtend: true }
 **/
export function parse (chars: string = '') {
  const tokens = tokenizer(chars)
  const properites = compile(tokens)
  return properites
}
