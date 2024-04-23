'use strict';
//webpack 設定https://awdr74100.github.io/2020-03-16-webpack-babelloader/
const { PATHS } = require('./paths')


module.exports = {
  mode: 'production', 
  entry: {
    index: PATHS.src + '/index.ts',
  },
  output: {
    path: PATHS.build,
    filename: '[name].js',
    library: '[name]', 
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  stats: {
    all: false,
    errors: true,
    builtAt: true,
  },
  resolve: {
    extensions: ['.tsx','.ts', '.js']
  },
  optimization: {
    minimize: false
  }


};