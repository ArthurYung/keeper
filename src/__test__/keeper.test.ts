import { test } from 'vitest'
import { createKeeper } from '../keeper'

test('createKeeper', ({ expect }) => {
  const keeper = createKeeper(
    `
key1 bool
`,
    {}
  )

  const source = {
    key1: 'true'
  }

  const result = keeper.from(source)
  expect(result).toMatchInlineSnapshot(`
    {
      "key1": true,
    }
  `)
})

test('createKeeper all types', ({ expect }) => {
  const keeper = createKeeper(
    `
  key1 bool
  key2 int
  key3 float
  key4 string
  key5 object
  key6 undefined
  key7 void
  key8 func
  key9 object
  `,
    {}
  )
  const source = {
    key1: 'true',
    key2: '1',
    key3: '1.1',
    key4: 'string',
    key5: '',
    key6: undefined,
    key7: null,
    key9: undefined,
    key10: 'test' // be clear
  }

  const result = keeper.from(source)
  expect(result).toMatchInlineSnapshot(`
    {
      "key1": true,
      "key2": 1,
      "key3": 1.1,
      "key4": "string",
      "key5": String {},
      "key7": undefined,
      "key8": [Function],
      "key9": {},
    }
  `)
})

test('extend keeper', ({ expect }) => {
  const keeper1 = createKeeper(
    `
sourcekey1 bool
sourcekey2 int

`,
    {}
  )

  const keeper2 = createKeeper(
    `
key1 string
key2 *keeper1
`,
    { extends: { keeper1 } }
  )

  const source = {
    key1: true,
    key2: {}
  }
  const result = keeper2.from(source)
  expect(result).toMatchInlineSnapshot(`
    {
      "key1": "true",
      "key2": {
        "sourcekey1": false,
        "sourcekey2": 0,
      },
    }
  `)

  const result2 = keeper2.read(source, 'key1')
  const result3 = keeper2.read(source, 'key2.sourcekey1')

  expect(result2).toMatchInlineSnapshot('"true"')
  expect(result3).toMatchInlineSnapshot('false')
})

test('extend array property', ({ expect }) => {
  const keeper1 = createKeeper(
    `
sourcekey1 bool
sourcekey2 int

`,
    {}
  )

  const keeper2 = createKeeper(
    `
key1 string
key2 *keeper1[]
`,
    { extends: { keeper1 } }
  )

  const source = {
    key1: true,
    key2: [
      {
        sourcekey1: 1,
        sourcekey2: '2'
      },
      // empty object
      {}
    ]
  }
  const result = keeper2.from(source)
  expect(result).toMatchInlineSnapshot(`
    {
      "key1": "true",
      "key2": [
        {
          "sourcekey1": true,
          "sourcekey2": 2,
        },
        {
          "sourcekey1": false,
          "sourcekey2": 0,
        },
      ],
    }
  `)
})

test('deep extend property', ({ expect }) => {
  const extendSource = createKeeper(
    `
sourcekey1 bool
sourcekey2 int

`,
    {}
  )

  const extendDeep = createKeeper(
    `
key1 string
key2 *extend
`,
    { extends: { extend: extendSource } }
  )

  const keeper = createKeeper(
    `
key1 string
key2 *extend
`,
    {
      extends: { extend: extendDeep }
    }
  )

  expect(keeper.from({})).toMatchInlineSnapshot(`
    {
      "key1": "",
      "key2": {
        "key1": "",
        "key2": {
          "sourcekey1": false,
          "sourcekey2": 0,
        },
      },
    }
  `)
})
