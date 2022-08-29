const path = require("path");
const webpack = require("webpack");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: path.resolve(__dirname, "../src/index.js"),
  output: {
    path: path.resolve(__dirname, "../dist"),
    // filename: "[name].[chunkhash:8].js",
    // chunkFilename: "[name].[chunkhash:8].js",
    filename: "[name].js",
    chunkFilename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /.css$/,
        use: ["css-loader"],
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin(), new CleanWebpackPlugin()],
};
