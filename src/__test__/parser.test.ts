import { test } from 'vitest'
import { parse } from '../parser'

test('should parse a single line correctly', ({ expect }) => {
  const input = 'key1 string'
  const result = parse(input)
  expect(result).toMatchInlineSnapshot(`
    Map {
      "key1" => {
        "isArray": false,
        "isExtend": false,
        "key": "key1",
        "name": "key1",
        "type": "string",
      },
    }
  `)
})

test('should parse multiple lines correctly', ({ expect }) => {
  const input = `
   key1 bool
  key2 int
`
  const result = parse(input)
  expect(result).toMatchInlineSnapshot(`
    Map {
      "key1" => {
        "isArray": false,
        "isExtend": false,
        "key": "key1",
        "name": "key1",
        "type": "bool",
      },
      "key2" => {
        "isArray": false,
        "isExtend": false,
        "key": "key2",
        "name": "key2",
        "type": "int",
      },
    }
  `)
})

test('test parsing of all types correctly', ({ expect }) => {
  const input = `
key1 bool
key2 int
key3 float
key4 string
key5 null
key6 undefined
key7 void
key8 func
key9 object
`
  const result = parse(input)
  expect(result).toMatchInlineSnapshot(`
    Map {
      "key1" => {
        "isArray": false,
        "isExtend": false,
        "key": "key1",
        "name": "key1",
        "type": "bool",
      },
      "key2" => {
        "isArray": false,
        "isExtend": false,
        "key": "key2",
        "name": "key2",
        "type": "int",
      },
      "key3" => {
        "isArray": false,
        "isExtend": false,
        "key": "key3",
        "name": "key3",
        "type": "float",
      },
      "key4" => {
        "isArray": false,
        "isExtend": false,
        "key": "key4",
        "name": "key4",
        "type": "string",
      },
      "key5" => {
        "isArray": false,
        "isExtend": false,
        "key": "key5",
        "name": "key5",
        "type": "null",
      },
      "key6" => {
        "isArray": false,
        "isExtend": false,
        "key": "key6",
        "name": "key6",
        "type": "undefined",
      },
      "key7" => {
        "isArray": false,
        "isExtend": false,
        "key": "key7",
        "name": "key7",
        "type": "void",
      },
      "key8" => {
        "isArray": false,
        "isExtend": false,
        "key": "key8",
        "name": "key8",
        "type": "func",
      },
      "key9" => {
        "isArray": false,
        "isExtend": false,
        "key": "key9",
        "name": "key9",
        "type": "object",
      },
    }
  `)
})

test('test array type correctly', ({ expect }) => {
  const input = `
  key1 bool[]
  key2 int
  `
  const result = parse(input)
  expect(result).toMatchInlineSnapshot(`
    Map {
      "key1" => {
        "isArray": true,
        "isExtend": false,
        "key": "key1",
        "name": "key1",
        "type": "bool",
      },
      "key2" => {
        "isArray": false,
        "isExtend": false,
        "key": "key2",
        "name": "key2",
        "type": "int",
      },
    }
  `)
})

test('test extends type correctly', ({ expect }) => {
  const input = `
  key1 *other
      key2 int
      `
  const result = parse(input)
  expect(result).toMatchInlineSnapshot(`
    Map {
      "key1" => {
        "isArray": false,
        "isExtend": true,
        "key": "key1",
        "name": "key1",
        "type": "other",
      },
      "key2" => {
        "isArray": false,
        "isExtend": false,
        "key": "key2",
        "name": "key2",
        "type": "int",
      },
    }
  `)
})

test('test copy as type correctly', ({ expect }) => {
  const input = `
  key1 bool copyas:other
  `
  const result = parse(input)
  expect(result).toMatchInlineSnapshot(`
    Map {
      "other" => {
        "isArray": false,
        "isExtend": false,
        "key": "key1",
        "name": "other",
        "type": "bool",
      },
      "key1" => {
        "isArray": false,
        "isExtend": false,
        "key": "key1",
        "name": "key1",
        "type": "bool",
      },
    }
  `)
})

test('test rename for type correctly', ({ expect }) => {
  const input = `
  key1 bool renamefor:other
  `
  const result = parse(input)
  expect(result).toMatchInlineSnapshot(`
    Map {
      "key1" => {
        "isArray": false,
        "isExtend": false,
        "key": "key1",
        "name": "key1",
        "type": "bool",
      },
    }
  `)
})
