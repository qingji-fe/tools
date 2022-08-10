class SingleEntryPlugin {
  constructor(context, entry, name) {
    this.context = context; //上下文目录 绝对day4
    this.entry = entry; //入口文件 相对路径
    this.name = name; //名称 main
  }
  apply(compiler) {
    compiler.hooks.make.tapAsync(
      "SingleEntryPlugin",
      (compilation, callback) => {
        console.log("make执行");
        const { context, entry, name } = this;
        // const dep = SingleEntryPlugin.createDependency(entry, name);

        compilation.addEntry(context, entry, name, (info) => {
          callback(info);
        });
      }
    );
  }
  static createDependency(entry, name) {
    const dep = new SingleEntryDependency(entry);
    dep.loc = { name };
    return dep;
  }
}

module.exports = SingleEntryPlugin;
