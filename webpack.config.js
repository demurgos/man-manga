const webpack = require('webpack');
const path = require('path');

const PROJECT_ROOT = __dirname;

// https://github.com/webpack/docs/wiki/how-to-write-a-loader#programmable-objects-as-query-option

module.exports = {
  context: PROJECT_ROOT,
  target: 'web',
  entry: "./build/client/client/main.js",
  output: {
    path: path.resolve(PROJECT_ROOT, "build/webpack"),
    filename: "bundle.js"
  },
  resolve: {
    extensions: ['.js', '.json']
  },
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['angular2-template-loader'] },
      { test: /\.json$/, loader: 'json-loader' }
    ]
  },
  plugins: [
    new webpack.ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /angular(\\|\/)core(\\|\/)src(\\|\/)linker/,
      path.resolve(PROJECT_ROOT, "build/client"),
      {}
    )
  ],
  devtool: 'inline-source-map',
  node: {
    global: true,
    __dirname: true,
    __filename: true,
    process: true,
    Buffer: false
  }
};
