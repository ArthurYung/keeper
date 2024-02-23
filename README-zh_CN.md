# <a href align="center">Keeper JS</a>

简体中文  |  [English](./README.md)
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

Keeper是一个用于安全访问js对象属性的库。

它通过接收一个描述对象类型的字符串来生成一个守护者实例(Keeper)，通过这个实例提供的API，我们可以访问符合预期的安全数据类型，或者创建一个完全符合类型描述的新对象来使用。

Keeper还具有出色的TypeScript支持。它可以根据接收到的类型描述字符串生成相应的类型声明文件，从而无需手动创建这些文件。

一个简单的例子：

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



# 📦 安装

```shell
npm i keeper-js
````

# 🔨 使用

### 类型描述
Keeper通过接收一个描述对象的字符串文本来定义对象，该字符串应遵循以下格式（多余空格会被忽略）：
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

### 对象访问
Keeper实例提供两个方法用于获取数据，`from(obj)`和`read(obj, path)`分别用于根据类型描述和源对象生成一个新对象和根据类型描述获取源对象中指定path的值。

当我们需要安全获取对象中的某个值时，可以用 `read` API 来操作，例如
```javascript
const sourceData = {
  id: '1',
  scores:  ['80.1', '90'],
  info: { name: 'bruce', user_age: '18.0' }
}
const name = human.read(sourceData, 'id') // 1
```

该方法支持多层嵌套访问，例如：
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

当我们期望从源数据修正并得到一个完全符合类型声明定义的对象时，可以用 `from` API 来操作，例如：
```javascript
const sourceData = {
  id: '1',
  bros: [],
  info: { name: 'bruce', user_age: '18.1' }
}
human.from(sourceData) // { id: 1, bros: [], { name: 'bruce', age: 18 } }
```

注意，当原数据为空并且对应声明属性不为空类型时（null|undefined），会根据声明的类型给出一个默认值，例如：
```javascript
const sourceData = {
  id: '1',
  bros: [],
  info: {}
}
human.from(sourceData) // { id: 1, bros: [], { name: '', age: 0 } }
human.read(sourceData, 'bros[0].age') // 0
```

### Typescript支持

Keeper拥有良好的ts支持，可以通过导出的`DefineKeeperInterface`类型从定义的keeper实例获取ts类型
![Monosnap screencast 2024-02-24 01-12-58](https://github.com/ArthurYung/keeper/assets/29910365/3c754e2c-0d2e-47b1-a516-3c8448529923)

除此之外，`from()`和`read`方法也拥有良好的ts支持：
![Monosnap screencast 2024-02-24 01-22-08](https://github.com/ArthurYung/keeper/assets/29910365/682fe9fd-8619-4dd0-b8de-64cbe71f2b15)
![Monosnap screencast 2024-02-24 01-23-19](https://github.com/ArthurYung/keeper/assets/29910365/9f73dcff-7e5c-4922-bf68-b0b43194d743)


# 支持的类型
| 数据类型 | 对于js类型 | 默认值 | 备注 |
| ---- | --- | --- | --- |
| bool | boolean | false | - |
| int | number | 0 | 整数类型 |
| float | number | 0 | 浮点数类型 |
| string | string | '' | - |
| null | null | null | - |
| undefined | undefined | undefined | - |
| func | Function | () => {} | - |
| object | Object | {} | - |


# 开源协议

Keeper 遵循 [MIT 协议](./LICENSE)。
