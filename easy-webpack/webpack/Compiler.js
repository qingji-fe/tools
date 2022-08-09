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
      this.hooks.make.callAsync(compilation, (err) => {
        console.log("制作");
      });
    });
  }
  run() {
    this.hooks.run.callAsync(this, (err) => {
      console.log("run开始");
      this.compile();
    });
  }
}
module.exports = Compiler;
