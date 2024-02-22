# <a href align="center">Keeper JS</a>

<p align="center">
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

简体中文 | [English](./README.md)

Keeper是一个用于安全使用js对象属性的库。

它通过接收一个描述对象类型的字符串生成一个守护者实例(Keeper)，通过实例提供的api我们可以获得可以安全使用的数据类型，或是生成一个完全遵循类型描述的新对象。

它拥有良好的Typescript支持性，并且能根据所接收的类型描述字符串生成对应的类型声明文件，因此无需再次手动编写类型声明文件。

一个简单的例子：

```typescript
const typeSturct = `
  name string
  age  int    renamefrom:user_age
`;

const user = createKeeper(typeSturct);

// this type is {name: string, age: number}
const data = user.from({
  name: "bruce",
  user_age: "30.0",
});

const name = data.name; // bruce
const age = data.age; // 30
```

````

----

# 📦 安装

```shell
npm i keeper-js
````

```shell
yarn add keeper-js
```

```shell
pnpm add keeper-js
```
