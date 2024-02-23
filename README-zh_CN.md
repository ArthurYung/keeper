# <a href align="center">Keeper JS</a>

简体中文  |  [English](./README.md)
<p>
   <a href="https://www.npmjs.com/package/tdesign-react">
    <img src="https://img.shields.io/npm/l/tdesign-react.svg?sanitize=true" alt="License" />
  </a>
  <a href="https://codecov.io/gh/ArthurYung/keeper" >
    <img src="https://codecov.io/gh/ArthurYung/keeper/graph/badge.svg?token=93F49NOJ9E"/>
  </a>
  <a href="https://www.npmjs.com/package/tdesign-react">
    <img src="https://img.shields.io/npm/v/tdesign-react.svg?sanitize=true" alt="Version">
  </a>
  <a href="https://www.npmjs.com/package/tdesign-react">
    <img src="https://img.shields.io/npm/dm/tdesign-react.svg?sanitize=true" alt="Downloads" />
  </a>
</p>

Keeper是一个用于安全使用js对象属性的库。

它通过接收一个描述对象类型的字符串生成一个守护者实例(Keeper)，通过实例提供的api我们可以获得可以安全使用的数据类型，或是生成一个完全遵循类型描述的新对象。

它拥有良好的Typescript支持性，并且能根据所接收的类型描述字符串生成对应的类型声明文件，因此无需再次手动编写类型声明文件。

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

## 类型描述
Keeper通过接收一个描述对象的字符串文本来定义对象，该字符串应遵循以下格式（多余空格会被忽略）：
```
<property> <type> <extentions>
```

- <property>：属性名称，支持字符串或数字。
- <type>：属性类型，可以是基础类型（如 string、int、float，详情见下文）或数组类型（如 int[]）。此外，也支持使用 `*<extends>` 格式来实现类型的嵌套
- <extentions>（可选）：当前属性的额外描述，目前支持`<copyas>:<alias>`(复制当前类型为属性名为`<alias>`的新属性) 以及`<renamefrom>:<property>`(当前属性值从原始数据的`<property>`属性返回)

示例：
```typescript
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


