/*

  demo工具演示
  几个步骤
  1. 路径解析
  2. 模块下载
  3. 分析依赖
  4. 解析模块
*/

const RESOLVE = "RESOLVE"; // 加载成功
const PENDING = "PENDING"; // 等待加载

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
  judgeModulesState: function (key, modules) {
    for (let moduleName of key.split("-")) {
      if (modules[moduleName] === PENDING) {
        return PENDING;
      }
    }
    return RESOLVE;
  },
};

var eventWatch = {
  state: {}, // 模块的状态
  stateQueue: {}, // 模块状态的成功回调queue
  listen: function (deps, success) {
    deps.forEach((dep) => {
      if (!this.state[dep]) {
        this.state[dep] = PENDING; // 初始化每一个模块的状态
      }

      // if (!this.stateQueue[dep]) {
      //   this.stateQueue[dep] = {};
      //   this.stateQueue[dep].success = [];
      //   this.stateQueue[dep].success.push(success);
      // }
    });

    // ps(这里做a1  a2  同时)
    var depModulesName = deps.join("-");

    if (!this.stateQueue[depModulesName]) {
      this.stateQueue[depModulesName] = {};
      this.stateQueue[depModulesName].success = [];
      this.stateQueue[depModulesName].success.push(success);
    }

    console.log("statestatestate", deps, this.state, this.stateQueue);
    // let modulesName = deps.join("&"); // -> 'a&b'
    // let modulesEvent = tools.events[modulesName];
  },
  trigger: function (moduleName, RESOLVE) {
    this.state[moduleName] = RESOLVE;
    // let count = 0;
    // let res = [];
    // for (let name in this.stateQueue) {
    //   if (this.state[name] === RESOLVE) {
    //     this.stateQueue[name].success.forEach((successFn) => {
    //       res.push(successFn);
    //     });
    //     count += 1;
    //     this.stateQueue[name].done = true;
    //   } else if (this.state[name] === PENDING) {
    //     console.log("所有模块执行");
    //   }
    // }

    // if (count === Object.keys(this.stateQueue).length) {
    // }

    // ps(做所有模块的触发)
    for (let name in this.stateQueue) {
      console.log("successFnsuccessFn", this.state);
      if (this.stateQueue[name].done) continue;
      let res = tools.judgeModulesState(name, this.state);
      if (res === RESOLVE) {
        this.stateQueue[name].success.forEach((successFn) => {
          successFn.call(this, 1);
        });
        this.stateQueue[name].done = true;
      } else if (this.state[name] === PENDING) {
        console.log("所有模块执行");
      }
    }
  },
};

var cacheModules = {}; //  缓存模块

function MyModule(name, isMain) {
  this.name = name;
  this.src = tools.moduleNameToModulePath(name);
  this.exports = {}; // 读取的内容
  this.loadModule(this.src, this.name, isMain); // this    {name: 'main', src: './main.js'}
}
MyModule.prototype.loadModule = function (src, moduleName, isMain) {
  let scriptNode = document.createElement("script");
  scriptNode.type = "text/javascript";
  scriptNode.src = src;
  scriptNode.onload = function () {
    console.log("个人废物", isMain);
    if (!isMain) {
      eventWatch.trigger(moduleName, RESOLVE);
    }
  };
  document.body.appendChild(scriptNode); // 第3步加载main入口
};

// function Dependence(deps, success, failure) {
//   this.deps = deps;
//   this.success = success;
//   this.failure = failure;
// }
// Dependence.prototype.analyzeDep = function () {
//   this.deps.forEach((depModuleName) => {
//     if (cacheModules[depModuleName]) {
//       console.log("缓存了", cacheModules, depModuleName);
//       return cacheModules[depModuleName];
//     }
//     let module = new MyModule(depModuleName);
//     console.log("缓存了module", cacheModules, module);
//     cacheModules[module.name] = module;

//     module.loadModule(module.src);
//   });
// };

// 第1步 从data-main 上获取到主入口路径
function getDataMainEntryPath() {
  let dataMain = document.currentScript.getAttribute("data-main");
  return tools.pathToModuleName(dataMain);
}
const mainModule = getDataMainEntryPath(); // main

//第2步 主入口的加载
function mainEntryModuleLoad(mainModule) {
  var mainModuleLoad = new MyModule(mainModule, true); //  main
  // modules[mainModuleLoad.name] = mainModuleLoad;
}
mainEntryModuleLoad(mainModule);

// 第4步 获取主入口的require的依赖项
window.require = function (deps, success) {
  // let dep = new Dependence(deps, success, failure);
  if (!Array.isArray(deps)) {
    throw new Error("must be an Array");
  }
  deps.forEach((depModuleName) => {
    let module = new MyModule(depModuleName, false);
    module.loadModule(module.src, module.name, false);
  });
  eventWatch.listen(JSON.parse(JSON.stringify(deps)), success);
};
