const {
  Tapable,
  SyncHook,
  SyncBailHook,
  AsyncParallelHook,
  AsyncSeriesHook,
} = require("tapable");

class Compilation extends Tapable {
  constructor(compiler) {
    super();
    this.hooks = {
      // 一系列hooks
      seal: new SyncHook([]),
      beforeChunks: new SyncHook([]),
      afterChunks: new SyncHook([]),
      build: new SyncHook([]),
      beforeBuild: new SyncHook([]),
      afterBuild: new SyncHook([]),
    };
  }

  addEntry(context, entry, name) {
    console.log("1");
  }
}
module.exports = Compilation;
