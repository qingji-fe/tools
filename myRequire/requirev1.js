/*

  demo工具演示
  几个步骤
  1. 路径解析
  2. 模块下载
  3. 分析依赖
  4. 解析模块
*/
// function MyModule(id) {
//   this.id = id; // 模块的路径
//   this;
// }

// utils工具类
var tools = {
  pathToModuleName: function (path) {
    let reg = /\w*.js/;
    let output = reg.exec(path);
    if (!output) {
      return path;
    } else {
      return output[0].split(".")[0];
    }
  },
  moduleNameToModulePath: function moduleNameToModulePath(name) {
    let reg = /\w*.js/;
    let output = reg.exec(name);
    if (!output) {
      return `./${name}.js`;
    } else {
      return name;
    }
  },
};

// var modules = {};

function MyModule(name) {
  this.name = name;
  this.src = tools.moduleNameToModulePath(name);
  this.loadModule(this.src); // this    {name: 'main', src: './main.js'}
}
MyModule.prototype.loadModule = function (src) {
  let scriptNode = document.createElement("script");
  scriptNode.type = "text/javascript";
  scriptNode.src = src;
  document.body.appendChild(scriptNode); // 第3步加载main入口
};

function Dependence(deps, success, failure) {
  this.deps = deps;
  this.success = success;
  this.failure = failure;
}
Dependence.prototype.analyzeDep = function () {
  this.deps.forEach((depModuleName) => {
    // if (!modules[depModuleName]) {
    let module = new MyModule(depModuleName);
    //   console.log("割发代首", module);
    //   module.loadModule(module.src);
    //   // modules[module.name] = module;
    // }
    module.loadModule(module.src);
  });
};
// 第4步 获取主入口的require的依赖项
window.require = function (deps, success, failure) {
  let dep = new Dependence(deps, success, failure);
  dep.analyzeDep();
  console.log("的点点滴滴", dep);
  console.log("ff的点点滴滴多若若");
};

// 第1步 从data-main 上获取到主入口路径
function getDataMainEntryPath() {
  let dataMain = document.currentScript.getAttribute("data-main");
  return tools.pathToModuleName(dataMain);
}
const mainModule = getDataMainEntryPath(); // main

//第2步 主入口的加载
function mainEntryModuleLoad(mainModule) {
  var mainModuleLoad = new MyModule(mainModule); //  main
  // modules[mainModuleLoad.name] = mainModuleLoad;
}
mainEntryModuleLoad(mainModule);
