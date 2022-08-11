const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: path.resolve(__dirname, "../src/index.js"),
  output: {
    filename: "[name].[fullhash].js",
    path: path.resolve(__dirname, "../dist"),
  },
  plugins: [new HtmlWebpackPlugin(), new CleanWebpackPlugin()],
};
