const path = require("path");
const fs = require("fs");
const {
  Tapable,
  SyncHook,
  SyncBailHook,
  AsyncParallelHook,
  AsyncSeriesHook,
} = require("tapable");
const Compilation = require("./Compilation");

class Compiler extends Tapable {
  constructor(context) {
    super();
    this.hooks = {
      // 一系列hooks
      done: new AsyncSeriesHook(["stats"]),
      run: new AsyncSeriesHook(["compiler"]),
      emit: new AsyncSeriesHook(["compilation"]),
      beforeCompile: new AsyncSeriesHook(["params"]),
      compile: new SyncHook(["params"]),
      make: new AsyncParallelHook(["compilation"]),
      afterCompile: new AsyncSeriesHook(["compilation"]),

      entryOption: new SyncHook(["context", "entry"]),
    };
  }
  compile() {
    this.hooks.beforeCompile.callAsync({}, (err) => {
      console.log("编译前");

      this.hooks.compile.call();
      console.log("开始编译");
      const compilation = new Compilation(this);
      this.hooks.make.callAsync(compilation, (info) => {
        console.log("make制作完成", info);
        compilation.seal((chunk) => {
          console.log("封装chunk完成", chunk);
          this.emit(chunk);
        });
      });
    });
  }
  run() {
    this.hooks.run.callAsync(this, (err) => {
      console.log("run开始");
      this.compile();
    });
  }
  emit(code) {
    const { output } = this.options;
    const filePath = path.join(output.path, output.filename);
    const newCode = JSON.stringify(code);
    const bundle = `(function(modules){
            function require(moduleId){
                function localRequire(relativePath){
                  return require(modules[moduleId].dependencies[relativePath]) 
                }
                var exports = {};
                (function(require,exports,code){
                  eval(code)
                })(localRequire,exports,modules[moduleId].code)
                return exports;
            }
            require('${this.entry}')
        })(${newCode})`;
    fs.writeFileSync(filePath, bundle, "utf-8");
  }
}
module.exports = Compiler;
