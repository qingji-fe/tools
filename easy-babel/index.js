const defaultTokenType = {
  identifier: {
    type: "Identifier",
    regx: /[a-zA-Z\$\_]/,
  },
  equal: {
    type: "Equal",
    chars: ["="],
  },
  string: {
    type: "String",
    chars: ['"', "'"],
  },
  number: {
    type: "Number",
    regx: /[0-9\.]/,
  },
  punctuator: {
    type: "Punctuator",
    chars: [";"],
  },
  whitespace: {
    type: "Equal",
    regx: /\s/,
  },
};
function deepclone(target) {
  return JSON.parse(JSON.stringify(target));
}

// 生成tokens
class Tokenizer {
  constructor(sourceCode) {
    this.sourceCode = sourceCode;
    this.curIndex = 0;
  }
  char() {
    return this.sourceCode[this.curIndex];
  }

  spaces() {
    const str = this.sourceCode[this.curIndex];
    if (/\s/.test(str)) {
      this.curIndex++;
    }
  }
  readKeyWord(type) {
    const value = this.sourceCode[this.curIndex];
    const token = defaultTokenType[type];
    if (token.regx.test(value)) {
      const result = {
        type: token.type,
        value: value,
      };
      this.curIndex++;

      while (token.regx.test(this.char())) {
        result.value += this.char();
        this.curIndex++;
      }
      return result;
    }
  }
  readEqual(type) {
    const value = this.sourceCode[this.curIndex];
    const token = defaultTokenType[type];
    if (token.chars.includes(value)) {
      return {
        type: token.type,
        value: value,
      };
    }
  }
  readNumber(type) {
    const value = this.sourceCode[this.curIndex];
    const token = defaultTokenType[type];

    if (token.regx.test(value)) {
      const result = {
        type: token.type,
        value: value,
      };
      this.curIndex++;

      while (token.regx.test(this.char())) {
        result.value += this.char();
        this.curIndex++;
      }
      return result;
    }
  }
  getCurToken() {
    // 遇到前头空格跳过 格式化
    this.spaces();
    return (
      this.readKeyWord("identifier") ||
      this.readEqual("equal") ||
      this.readNumber("number")
    );
  }
  getTokens() {
    const tokens = [];
    while (this.curIndex < this.sourceCode.length) {
      const token = this.getCurToken();
      tokens.push(token);
      this.curIndex++;
    }
    return tokens;
  }
}
// 构建Program
class Program {
  constructor(config = {}) {
    this.type = "Program";
    this.body = config.body || [];
    this.sourceType = config.sourceType || "script";
  }
}
// 构建kind
class Kind {
  constructor(config) {
    this.kind = config.kind;
  }
}

// 法语tokens解析
class ParserTokens {
  constructor(tokens) {
    this.tokens = tokens;
    this.curIndex = -1;
    this.token = this.tokens[this.curIndex];
  }
  next() {
    this.curIndex += 1;
    const token = this.tokens[this.curIndex];
    this.token = token;
  }
  fnExpression() {
    this.next();
    if (this.token.type === "Number") {
      return {
        type: "NumberLiteral",
        value: this.token.value,
      };
    }
    if (this.token.type === "string") {
      return {
        type: "StringLiteral",
        value: this.token.value,
      };
    }
  }
  walk() {
    this.next();
    // 如果只是一个声明
    if (
      this.token.type === defaultTokenType.identifier.type &&
      (this.token.value === "const" ||
        this.token.value === "let" ||
        this.token.value === "var")
    ) {
      const declarations = {
        type: "VariableDeclaration",
        kind: this.token.value,
      };
      this.next();
      if (this.token.type !== "Identifier") {
        throw new Error("Expected Variable after const");
      }
      declarations.declarations = [
        {
          type: "VariableDeclarator",
        },
      ];
      declarations.declarations[0].id = {
        type: "Identifier",
        name: this.token.value,
      };
      this.next();
      if (this.token.type === "Equal" && this.token.value === "=") {
        declarations.declarations[0].init = this.fnExpression();
      }
      return declarations;
    }
  }
  getAst() {
    const astRoot = new Program({
      sourceType: "script",
      body: [],
    });
    console.log("ast", astRoot);
    while (this.curIndex < this.tokens.length - 1) {
      const astNode = this.walk();
      if (!astNode) {
        break;
      }
      astRoot.body.push(astNode);
    }
    return astRoot;
  }
}

// 转换ast
class Transformer {
  constructor(ast) {
    this.ast = ast;
  }
  traverseArray(body, parent) {
    body.forEach((item) => {
      this.traverse(item, parent);
    });
  }
  traverse(ast, visitor) {
    function traverseArray(array, parent) {
      array.forEach((child) => {
        traverseNode(child, parent);
      });
    }
    function traverseNode(node, parent) {
      let methods = visitor[node.type];
      if (methods && methods.enter) {
        methods.enter(node, parent);
      }
      switch (node.type) {
        case "Program":
          traverseArray(node.body, node);
          break;
        case "VariableDeclaration":
          traverseArray(node.declarations, node);
          break;
        case "VariableDeclarator":
          traverseNode(node.id, node);
          traverseNode(node.init, node);
          break;
        case "NumberLiteral":
        case "StringLiteral":
        case "Identifier":
          break;
        default:
          throw new TypeError(node.type);
      }
      if (methods && methods.exit) {
        methods.exit(node, parent);
      }
    }
    traverseNode(ast, null);
  }
  getNewAst() {
    const newAst = deepclone(ast);
    this.traverse(newAst, {
      VariableDeclaration: {
        enter(node, parent) {
          node.kind = "var";
        },
      },
    });
    return newAst;
  }
}

class CodeGenerator {
  constructor(ast) {
    this.ast = ast;
  }
  getCode() {
    function getCode(ast) {
      switch (ast.type) {
        case "Program":
          return ast.body.map(getCode).join("\n");
        case "Identifier":
          return ast.name;
        case "NumberLiteral":
          return ast.value;
        case "StringLiteral":
          return '"' + ast.value + '"';
        case "VariableDeclaration":
          return `${ast.kind} ${ast.declarations.map(getCode).join("\n")}`;
        case "VariableDeclarator":
          return `${getCode(ast.id)} = ${getCode(ast.init)}`;
        default:
          throw new TypeError(ast.type);
      }
    }
    return getCode(this.ast);
  }
}

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
