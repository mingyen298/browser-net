'use strict';
//webpack 設定https://awdr74100.github.io/2020-03-16-webpack-babelloader/
const { PATHS } = require('./paths')
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    main: PATHS.test_src + '/main.js',
    sw: PATHS.test_src + '/sw.js',
    popup: PATHS.test_src + '/popup.js',
  },
  output: {
    path: PATHS.test_build,
    filename: '[name].js',
  },
  stats: {
    all: false,
    errors: true,
    builtAt: true,
  },
  optimization: {
    minimize: false
  }
  ,
  plugins: [
    // Copy static assets from `public` folder to `build` folder
    new CopyWebpackPlugin({
      patterns: [
        {
          from: '**/*',
          context: 'test/public',
        },
      ]
    })
  ],

};