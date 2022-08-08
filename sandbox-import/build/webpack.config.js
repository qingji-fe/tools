const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: path.resolve(__dirname, "../src/index.js"),
  // entry: {
  //   main: path.resolve(__dirname, '../src/js/index.js'),
  // },
  output: {
    filename: "[name].[fullhash].js",
    path: path.resolve(__dirname, "../dist"),
  },
  plugins: [
    new HtmlWebpackPlugin(),
    // 配置多个 HtmlWebpackPlugin，有多少个页面就配置多少个
    // new HtmlWebpackPlugin({
    //   template: path.resolve(__dirname, '../src/html/index.html'),
    //   filename: 'index.html',
    //   chunks: ['main']
    // }),
    // new HtmlWebpackPlugin({
    //   template: path.resolve(__dirname, '../src/html/header.html'),
    //   filename: 'header.html',
    //   chunks: ['header']
    // }),
    // new HtmlWebpackPlugin({
    //   template: path.resolve(__dirname, '../src/html/footer.html'),
    //   filename: 'footer.html',
    //   chunks: ['footer']
    // }),
    new CleanWebpackPlugin(),
  ],
};
