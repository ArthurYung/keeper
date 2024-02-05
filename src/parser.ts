import { SymbolExtensionTable, SymbolTypeTable } from './table'

export interface ProperiteItem {
  type: string
  key: string
  name: string
  isArray?: boolean
  isExtend?: boolean
}

export type ProperiteItemMap = Map<string, ProperiteItem>

function tokenizer (chars: string = ''): string[][] {
  return chars.split(/\r?\n/).map((lineChars) => lineChars.split(/\s+/))
}

function compile (tokens: string[][]) {
  const properites = new Map<string, ProperiteItem>()
  for (const token of tokens) {
    const properite = parseToken(token)
    const extensions = parseExtension(token[2])

    if (extensions.rename) {
      properite.name = extensions.rename
    }

    if (extensions.copy) {
      properites.set(extensions.copy, {
        ...properite,
        name: extensions.copy
      })
    }

    properites.set(properite.name, properite)
  }

  return properites
}

function parseType (value: string) {
  let isArray = false
  let isExtend = false
  let type = value
  if (type.substring(type.length - 2, type.length) === SymbolTypeTable.ARRAY) {
    isExtend = true
    type = type.substring(0, type.length - 2)
  }

  if (type.charAt(0) === SymbolTypeTable.EXTEND) {
    isArray = true
    type = type.substring(1)
  }

  return {
    isArray,
    isExtend,
    type
  }
}

function parseExtension (value = '') {
  const extensions: { [x in SymbolExtensionTable]?: string } = {}
  value.split(';').forEach((item) => {
    const [key, value] = item.split(':')
    if (key === SymbolExtensionTable.RENAME) {
      extensions[SymbolExtensionTable.RENAME] = value
      return
    }

    if (key === SymbolExtensionTable.COPY) {
      extensions[SymbolExtensionTable.COPY] = value
    }
  })

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

export function parse (chars: string = '') {
  const tokens = tokenizer(chars)
  const properites = compile(tokens)
  return properites
}
