const SingleEntryPlugin = require("./SingleEntryPlugin");
class EntryOptionPlugin {
  apply(compiler) {
    compiler.hooks.entryOption.tap("entryOption", (context, entry) => {
      new SingleEntryPlugin(context, entry, "main").apply(compiler);
    });
  }
}
module.exports = EntryOptionPlugin;
