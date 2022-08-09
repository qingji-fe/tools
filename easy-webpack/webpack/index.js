const Compiler = require("./Compiler");
const WebpackOptionsApply = require("./plugins/WebpackOptionsApply");
function initCompiler(context) {
  let compiler = new Compiler(context);
  return compiler;
}
function initInternalPlugin(options, compiler) {
  new WebpackOptionsApply().process(options, compiler);
}
function webpack(options) {
  // 初始化-处理参数
  options.context = process.cwd();
  console.log("options", options);

  // 初始化-创建compiler
  let compiler;
  compiler = initCompiler(options.context);
  compiler.options = options;

  // 初始化-加载内部插件
  initInternalPlugin(options, compiler);
  return compiler;
}
module.exports = webpack;
