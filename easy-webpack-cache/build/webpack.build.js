const path = require("path");

const { merge } = require("webpack-merge");
const common = require("./webpack.config.js");

module.exports = merge(common, {
  mode: "development",
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
        },
      },
    },
    // runtimeChunk: {
    //   name: "runtime",
    // },
  },
});

//    // 第三方模块
//    vendor: {
//     name: 'vendor',
//     // 对于像loadsh可能被判定为公共模块，也可能被判定为第三分模块，设置第三方模块的优先级高于公共模块，就可以被优先检测
//     priority: 1,
//     // 检测方法，通过是否来自node_modules来判断的
//     test: /node_modules/,
//     // 为了看到代码分割的效果，把值设置到最小
//     minsize: 0,
//     minChunks: 1
// },
// // 公共模块
// common: {
//     // 每个组的名字
//     name: 'common',
//     // 优先级，优先级越高，越先检测处理,
//     priority: 0,
//     // 实际开发中，可以写成5*1024,即5kb
//     minsize: 0,
//     // 检测模块被引用了几次
//     // 对于第三方模块，引用1次就应该单独打包
//     // 对于公共模块，引用2次以上就该单独打包
//     minChunks: 2
// }
