## 概述

babel **是一个 JavaScript 编译器**, 将高版本的语言编译成当下版本可以用的语言,比如我们项目中可以随意使用 es7 的语法来写项目

## babel 做了啥

### 转译过程

babel 主要做的是编译，分三个过程

- 解析过程
  将写的代码解析成一个抽象语法树，使用地址https://astexplorer.net/查看，这个过程中主要在做的是**词法分析**和**语法分析**
- 转换过程
  通过上一个过程的语法树，对某个树的节点进行 curd
- 生成过程
  转换的语法树生成真实的代码

![](https://user-images.githubusercontent.com/21278158/187816182-cd316d41-67db-44ec-9e6a-619b1c86aae7.png)

### 示例

原始 code

```js
const a = 1;
```

语法树
![](https://user-images.githubusercontent.com/21278158/187815402-e963e312-e789-44b4-b39a-a2adfc2d704e.png)

## babel 过程的原理

### 语法树如何生成

#### 词法分析

参考使用https://esprima.org/demo/parse.html#查看
对源代码的分词
![](https://user-images.githubusercontent.com/21278158/187817751-259bd1ff-2077-41f5-b434-1e1433cb07eb.png)

```js
const a = 1;
// 拆分成的tokens
var tokens = [
  {
    type: "Keyword",
    value: "const",
  },
  {
    type: "Identifier",
    value: "a",
  },
  {
    type: "Punctuator",
    value: "=",
  },
  {
    type: "Numeric",
    value: "1",
  },
];
```

**如何词法分析**

先看下词法单元 如： 2022 年是祖国 70 周年, 可以把这句话拆成最小单元即：2022 年、是、祖国、70、周年
js 拆分规则是

- 关键字：var、let、const
- 标识符：没有被引号括起来的连续字符，可能是一个变量，也可能是 if、else 这些关键字，又或者是 true、false 这些内置常量
- 运算符： +、-、 \*、/
- 数字：像十六进制，十进制，八进制以及科学表达式等语法
- 字符串
- 空格：空格，换行，缩进
- 注释：行注释或块注释
- 其他：大括号、小括号、分号、冒号

#### 语法分析

对词法分析的 tokens 进行遍历组合,生成对应的语法树。

![](https://user-images.githubusercontent.com/21278158/187818075-b736e0f4-6e8a-4484-ab94-69144ce1350a.png)

## babel 项目

### git

![](https://user-images.githubusercontent.com/21278158/187839057-b24e4cb9-27c1-4c39-9c2c-940df0e402a6.png)

由几十个项目组成的 Monorepo。

### 核心包

- @babel/parser（解析生成 ast）
- @babel/traverse（遍历 ast 对其 curd）
- @babel/generate（新的 ast 输出转为新的 code）
- @babel/types（对 ast 类型判断创建）
- @babel/core（解析配置、应用 plugin、preset，整体编译流程）

## 简易实现

可以参考[easy-babel](https://github.com/qingji-fe/tools/blob/main/easy-babel/index.js)

```js
var sourceCode = "const a = 1";
var tokenizer = new Tokenizer(sourceCode);
var tokens = tokenizer.getTokens();

var parser = new ParserTokens(tokens);
var ast = parser.getAst();

var transformer = new Transformer(ast);
var newAst = transformer.getNewAst();

var codeGenerator = new CodeGenerator(newAst);
var newCode = codeGenerator.getCode();

console.log("tokens", tokens);
console.log("ast", ast);
console.log("newAst", newAst);
console.log("newCode", newCode);
```

- 解析过程

  词法生成 tokens
  语法生成 ast

- 转换过程

  traverse 遍历 ast，访问者模式对 ast 进行转换

- 生成过程

  将 ast 转换为源代码

## babel 插件

babel 插件大致分为两种：**语法插件**和**转换插件**,语法插件作用于 @babel/parser，负责将代码解析为抽象语法树（AST）
转换插件作用于 @babel/core，负责转换 AST 的形态
绝大多数情况下我们都是在编写转换插件,来告知 Babel 需要做什么事情。如果没有插件，Babel 将原封不动的输出代码。

### 编写一个插件

- babel 插件规范

  其实编写 babel 插件很简单，只需要按照官方提供的规则写代码就 ok

- 开发插件
  ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ee6ef6a059574d67a65dc7d3785008c5~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

编写自己的插件需要默认为插件提供一个方法，该方法返回一个包含 visitor 属性的对象。visitor 也是一个对象，该对象属性支持不同节点类型对应的钩子函数，在这个函数内针对该类型的节点进行操作

### babel-plugin-import

```js
// 通过es规范，具名引入Button组件
import { Button } from "antd";
ReactDOM.render(<Button>xxxx</Button>);

// babel编译阶段转化为require实现按需引入
var _button = require("antd/lib/button");
ReactDOM.render(<_button>xxxx</_button>);
```

核心处理: 将 import 语句替换为对应的 require 语句

### 介绍在做的指令语法

- 背景

  我们在 react 写项目时候大多数据遇到 👇🏻 这样的大量三元运算,导致代码可读性不太好

  ```jsx
    render() {
      <div>
        {
          isxx
          ? <div>xxx</div>
          : null
        }
      </div>
    }
  ```

- 解法

  编写一套 babel 指令语法让代码变成 👇🏻 写法

  ```jsx
    render() {
      <div>
       <div qj-if={isxx}>xxx</div>
      </div>
    }
  ```

- 介绍
  可以参考[指令语法](https://github.com/qingji-fe/resonance/tree/main/babel-plugins-directives)

## 小结

可以去熟读 Babel 手册, 这是目前最好的教程,多去查看语法拆分过程，多写 code，或者官网的插件实现
