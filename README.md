# <a href align="center">Keeper JS</a>

English  |  [简体中文](./README-zh_CN.md)
<p>
   <a href="https://www.npmjs.com/package/keeper-js">
    <img src="https://img.shields.io/npm/l/keeper-js.svg?sanitize=true" alt="License" />
  </a>
  <a href="https://codecov.io/gh/ArthurYung/keeper" >
    <img src="https://codecov.io/gh/ArthurYung/keeper/graph/badge.svg?token=93F49NOJ9E"/>
  </a>
  <a href="https://www.npmjs.com/package/keeper-js">
    <img src="https://img.shields.io/npm/v/keeper-js.svg?sanitize=true" alt="Version">
  </a>
  <a href="https://www.npmjs.com/package/keeper-js">
    <img src="https://img.shields.io/npm/dm/keeper-js.svg?sanitize=true" alt="Downloads" />
  </a>
</p>

Keeper is a library for securely accessing properties of js objects.

It generates a Keeper instance by receiving a string describing the object type. Through the API provided by this instance, we can access data of the expected safe type, or create a new object that fully complies with the type description for use.

Keeper also has excellent TypeScript support. It can generate corresponding type declaration files based on the received type description string, eliminating the need to manually create these files.

Example:

```typescript
const userKeeper = createKeeper(`
  name string
  age  int    renamefrom:user_age
`);

// this type is {name: string, age: number}
const data = userKeeper.from({
  name: "bruce",
  user_age: "18.0",
});

console.log(data) // { name: 'bruce', age: 18 }
const age = userKeeper.read({ user_age: '18.2' }, 'age') // 18
```

# 📦 Install

```shell
npm i keeper-js
````

# 🔨 Usage

### Type Description
Keeper defines objects by receiving a string text describing the object. This string should follow the format below (extra spaces will be ignored):

```
<property> <type> <extentions>
```

- `<property>`：属性名称，支持字符串或数字。
- `<type>`：属性类型，可以是基础类型（如 string、int、float，详情见下文）或数组类型（如 int[]）。此外，也支持使用 `*<extends>` 格式来实现类型的嵌套
- `<extentions>`（可选）：当前属性的额外描述，目前支持`<copyas>:<alias>`(复制当前类型为属性名为`<alias>`的新属性) 以及`<renamefrom>:<property>`(当前属性值从源对象的`<property>`属性返回)

示例：
```typescript
import { createKeeper } from 'keeper-js';

const userInfo = createKeeper(`
   name    string
   age     int      renamefrom:user_age
`);

const human = createKeeper(`
  id      int
  scores  float[]
  info    *userInfo
`, { extends: { userInfo } }) // Declare the inherited attributes of userInfo.

const data = human.from({
  id: '1',
  scores:  ['80.1', '90'],
  info: { name: 'bruce', user_age: '18.0' }
});

// data: {
//   id: 1, 
//   scores: [80.1, 90], // Transform string into float number.
//   info: {
//     name: 'bruce',
//     age:  18,   // Retrieve the value from 'user_age' and convert the float string into an integer number.
//   }
// }
```

### Object Access
The Keeper instance provides two methods for data retrieval, `from(obj)` and `read(obj, path)`, which are used to generate a new object based on the type description and source object, and to get the value of the specified path in the source object according to the type description, respectively.

When we need to safely get a value from an object, we can use the read API to operate, for example:
```javascript
const sourceData = {
  id: '1',
  scores:  ['80.1', '90'],
  info: { name: 'bruce', user_age: '18.0' }
}
const name = human.read(sourceData, 'id') // 1
```
This method supports multi-layer nested access, for example:
```javascript
const userInfo = createKeeper(`
   name    string
   age     int      renamefrom:user_age
`);

const human = createKeeper(`
  id       int
  bros     *userInfo[]
  baseInfo *userInfo
`, { extends: { userInfo } }) // Declare the inherited attributes of userInfo.

const sourceData = {
  id: '1',
  bros: [{ name: 'bro1', user_age: '16.0' }, { name: 'bro2', user_age: '17.2' }],
  info: { name: 'bruce', user_age: '18.1' }
}
const name = human.read(sourceData, 'info.name') // 'bruce'
const bro1Name = human.read(sourceData, 'bros[0].name') // 'bro1'
```

When we expect to correct from the source data and get an object that fully conforms to the type declaration definition, we can use the `from` API to operate, for example:
```javascript
const sourceData = {
  id: '1',
  bros: [],
  info: { name: 'bruce', user_age: '18.1' }
}
human.from(sourceData) // { id: 1, bros: [], { name: 'bruce', age: 18 } }
```
Note that when the original data is empty and the corresponding declared property is not an empty type (null|undefined), a default value will be given according to the declared type, for example:
```javascript
const sourceData = {
  id: '1',
  bros: [],
  info: {}
}
human.from(sourceData) // { id: 1, bros: [], { name: '', age: 0 } }
human.read(sourceData, 'bros[0].age') // 0
```

### Typescript Support
Keeper has good ts support. You can get ts types from the defined keeper instance through the exported `DefineKeeperInterface` type.
![Monosnap screencast 2024-02-24 01-12-58](https://github.com/ArthurYung/keeper/assets/29910365/3c754e2c-0d2e-47b1-a516-3c8448529923)

In addition, the `from()` and `read()` methods also have good ts support:
![Monosnap screencast 2024-02-24 01-22-08](https://github.com/ArthurYung/keeper/assets/29910365/682fe9fd-8619-4dd0-b8de-64cbe71f2b15)
![Monosnap screencast 2024-02-24 01-23-19](https://github.com/ArthurYung/keeper/assets/29910365/9f73dcff-7e5c-4922-bf68-b0b43194d743)

# The supported types
| Data Type |	JS Type |	Default |	Remarks |
| ---- | --- | --- | --- |
| bool | boolean | false | - |
| int | number | 0 | Integer type |
| float | number | 0 | Floating point type |
| string | string | '' | - |
| null | null | null | - |
| undefined | undefined | undefined | - |
| func | Function | () => {} | - |
| object | Object | {} | - |

# License

[MIT](./LICENSE)。
