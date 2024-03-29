import { test } from "vitest";
import { fromObject, readProperiteValue } from "../api";
import { type KeeperConfig } from "../type";

const createMap = (source: any) => {
  const map = new Map(source);
  map._lazySource = () => {};
  return map;
};

test("should create a new object based on the properties", ({ expect }) => {
  const properties = createMap([
    ["key1", { type: "bool", key: "key1", name: "key1" }],
    ["key2", { type: "int", key: "key2", name: "key2" }],
  ]);

  const source1 = {
    key1: null,
    key2: 1.1,
  };

  const source2 = {
    key1: "fdsaf",
    key2: null,
  };

  const fromObjectAction = fromObject(properties, {});

  expect(fromObjectAction(source1)).toMatchInlineSnapshot(`
    {
      "key1": false,
      "key2": 1,
    }
  `);
  expect(fromObjectAction(source2)).toMatchInlineSnapshot(`
    {
      "key1": true,
      "key2": 0,
    }
  `);
});

test("test all types correctly", ({ expect }) => {
  const properties = createMap([
    ["key1", { type: "bool", key: "key1", name: "key1" }],
    ["key2", { type: "int", key: "key2", name: "key2" }],
    ["key3", { type: "float", key: "key3", name: "key3" }],
    ["key4", { type: "string", key: "key4", name: "key4" }],
    ["key5", { type: "null", key: "key5", name: "key5" }],
    ["key6", { type: "undefined", key: "key6", name: "key6" }],
    ["key7", { type: "void", key: "key7", name: "key7" }],
    ["key8", { type: "func", key: "key8", name: "key8" }],
    ["key9", { type: "object", key: "key9", name: "key9" }],
  ]);

  const source = {
    key1: true,
    key2: 1,
    key3: 1.1,
    key4: "string",
    key5: null,
    key6: undefined,
    key7: null,
    key8: function () {},
    key9: {},
  };

  const badSource = {
    key1: 1,
    key2: "string",
    key3: true,
    key4: 1,
    key5: undefined,
    key6: null,
    key7: undefined,
    key8: {},
    key9: null,
    clearKey: "clearKey", // be cleared
  };
  const fromObjectAction = fromObject(properties, {});

  expect(fromObjectAction(source)).toMatchInlineSnapshot(`
    {
      "key1": true,
      "key2": 1,
      "key3": 1.1,
      "key4": "string",
      "key5": null,
      "key7": undefined,
      "key8": [Function],
      "key9": {},
    }
  `);

  expect(fromObjectAction(badSource)).toMatchInlineSnapshot(`
    {
      "key1": true,
      "key2": 0,
      "key3": 1,
      "key4": "1",
      "key5": null,
      "key7": undefined,
      "key8": [Function],
      "key9": {},
    }
  `);
});

test("test array type", ({ expect }) => {
  const properties = createMap([
    ["key1", { type: "bool", key: "key1", name: "key1", isArray: true }],
    ["key2", { type: "int", key: "key2", name: "key2", isArray: true }],
  ]);

  const source = {
    key1: [true, false],
    key2: [1, 2],
  };

  const badSource = {
    key1: true,
    key2: "1",
  };

  const fromObjectAction = fromObject(properties, {});
  expect(fromObjectAction(source)).toMatchInlineSnapshot(`
    {
      "key1": [
        true,
        false,
      ],
      "key2": [
        1,
        2,
      ],
    }
  `);
  expect(fromObjectAction(badSource)).toMatchInlineSnapshot(`
    {
      "key1": [
        true,
      ],
      "key2": [
        1,
      ],
    }
  `);
});

test("test copy as properties", ({ expect }) => {
  const properties = createMap([
    ["key1", { type: "bool", key: "key1", name: "key1" }],
    ["key2", { type: "int", key: "key2", name: "key2" }],
    ["key3", { type: "int", key: "key2", name: "key3" }],
  ]);

  const source = {
    key1: true,
    key2: 1,
  };

  const fromObjectAction = fromObject(properties, {});
  const result = fromObjectAction(source);
  expect(result).toMatchInlineSnapshot(`
    {
      "key1": true,
      "key2": 1,
      "key3": 1,
    }
  `);
});

test("test rename from source properties", ({ expect }) => {
  const properties = createMap([
    ["key1", { type: "bool", key: "key1", name: "key1" }],
    ["key2", { type: "int", key: "key3", name: "key2" }],
  ]);

  const source = {
    key1: true,
    key3: 1,
  };

  const fromObjectAction = fromObject(properties, {});
  const result = fromObjectAction(source);
  expect(result).toMatchInlineSnapshot(`
    {
      "key1": true,
      "key2": 1,
    }
  `);
});

test("test extends properties", ({ expect }) => {
  const extendProperties = createMap([
    ["key1", { type: "bool", key: "key1", name: "key1" }],
    ["key2", { type: "int", key: "key2", name: "key2" }],
  ]);

  const properties = createMap([
    [
      "key3",
      { type: "other_source_type", key: "key3", name: "key3", isExtend: true },
    ],
  ]);

  const fromObjectAction = fromObject(properties, {
    extends: {
      other_source_type: {
        properties: extendProperties,
      },
    },
  } as unknown as KeeperConfig);

  const source = {
    key3: {
      key1: "true",
      key2: null,
      key3: "null", // be cleared
    },
  };

  expect(fromObjectAction(source)).toMatchInlineSnapshot(`
    {
      "key3": {
        "key1": true,
        "key2": 0,
      },
    }
  `);
});

test("readProperiteValue", ({ expect }) => {
  const extendProperties = createMap([
    ["key1", { type: "bool", key: "key1", name: "key1" }],
    ["key2", { type: "int", key: "key2", name: "key2" }],
  ]);

  const properties = createMap([
    [
      "key3",
      { type: "other_source_type", key: "key3", name: "key3", isExtend: true },
    ],
    [
      "key4",
      {
        type: "string",
        key: "key4",
        name: "key4",
        isArray: true,
      },
    ],
    [
      "key5",
      {
        type: "other_source_type",
        key: "key5",
        name: "key5",
        isArray: true,
        isExtend: true,
      },
    ],
  ]);

  const readProperiteValueAction = readProperiteValue(properties, {
    extends: {
      other_source_type: { properties: extendProperties },
    },
  } as unknown as KeeperConfig);

  const source = {
    key3: {
      key1: "true",
      key2: null,
      key3: "null",
    },
    key4: [1, 2],
    key5: [
      { key1: "true", key2: null },
      { key1: "false", key2: 1 },
    ],
  };

  const boolValue = readProperiteValueAction(source, "key3.key1");
  const intValue = readProperiteValueAction(source, "key3.key2");

  const arrayVal1 = readProperiteValueAction(source, "key4[0]");
  const arrayVal2 = readProperiteValueAction(source, "key4[2]");

  const arrExtendVal1 = readProperiteValueAction(source, "key5[0].key1");
  const arrExtendVal2 = readProperiteValueAction(source, "key5[3]");

  expect(boolValue).toBe(true);
  expect(intValue).toBe(0);
  expect(arrayVal1).toBe("1");
  expect(arrayVal2).toBe("");

  expect(arrExtendVal1).toBe(true);
  expect(arrExtendVal2).toMatchInlineSnapshot(`
    {
      "key1": false,
      "key2": 0,
    }
  `);
});
