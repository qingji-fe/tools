const webpack = require("../webpack");
const webpackConfig = require("../webpack.config");

let compiler = webpack(webpackConfig);

compiler.run();
