const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser"); //解析成ast
const traverse = require("@babel/traverse").default; //遍历ast
const { transformFromAst } = require("@babel/core"); //ES6转换ES5
const {
  Tapable,
  SyncHook,
  SyncBailHook,
  AsyncParallelHook,
  AsyncSeriesHook,
} = require("tapable");
const CompilerQueue = require("./queue/CompilerQueue");

class Compilation extends Tapable {
  constructor(compiler) {
    super();
    this.compilerQueue = new CompilerQueue(100);
    this.modulesArr = [];
    this.hooks = {
      // 一系列hooks
      seal: new SyncHook([]),
      beforeChunks: new SyncHook([]),
      afterChunks: new SyncHook([]),
      build: new SyncHook([]),
      beforeBuild: new SyncHook(["beforeBuild"]),
      afterBuild: new SyncHook([]),
      addEntry: new SyncHook([]),
    };
  }
  build(entryFile) {
    const conts = fs.readFileSync(entryFile, "utf-8");
    const ast = parser.parse(conts, {
      sourceType: "module",
    });
    const dependencies = {};
    traverse(ast, {
      ImportDeclaration({ node }) {
        const newPath =
          "./" + path.join(path.dirname(entryFile), node.source.value);
        dependencies[node.source.value] = newPath;
      },
    });
    const { code } = transformFromAst(ast, null, {
      presets: ["@babel/preset-env"],
    });
    return {
      entryFile,
      dependencies,
      code,
    };
  }
  createChunkAssets(callback) {
    //数组结构转换
    const obj = {};
    this.modulesArr.forEach((item) => {
      obj[item.entryFile] = {
        dependencies: item.dependencies,
        code: item.code,
      };
    });
    this.hooks.afterBuild.call();
    callback(obj);
  }
  seal(callback) {
    console.log("开始打包成chunk前");
    this.hooks.beforeChunks.call();
    console.log("开始打包成chunk");
    this.hooks.seal.call();
    this.createChunkAssets(callback);
    console.log("开始打包成chunk后");
    this.hooks.afterChunks.call();
  }

  addModuleChain(context, entry, name, callback) {
    this.compilerQueue.acquire(() => {
      console.log("模块编译队列");
      console.log("模块编译前");
      this.hooks.beforeBuild.call();
      console.log("模块编译中", entry);
      const info = this.build(entry);

      this.modulesArr.push(info);

      for (let i = 0; i < this.modulesArr.length; i++) {
        // 判断有依赖对象,递归解析所有依赖项
        const item = this.modulesArr[i];
        const { dependencies } = item;
        if (dependencies) {
          for (let j in dependencies) {
            this.modulesArr.push(this.build(dependencies[j]));
          }
        }
      }

      callback(this.modulesArr);
    });
  }
  addEntry(context, entry, name, callback) {
    this.hooks.addEntry.call(entry, name);
    console.log("开始分析模块依赖");
    this.addModuleChain(context, entry, name, callback);
  }
}
module.exports = Compilation;
