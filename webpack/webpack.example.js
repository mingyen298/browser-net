'use strict';
//webpack 設定https://awdr74100.github.io/2020-03-16-webpack-babelloader/
const { PATHS } = require('./paths')
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    main: PATHS.example_src + '/main.ts',
    sw: PATHS.example_src + '/sw.ts',
    popup: PATHS.example_src + '/popup.ts',
  },
  output: {
    path: PATHS.example_build,
    filename: '[name].js',
  },
  stats: {
    all: false,
    errors: true,
    builtAt: true,
  },
  optimization: {
    minimize: false
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
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },

  plugins: [
    // Copy static assets from `public` folder to `build` folder
    new CopyWebpackPlugin({
      patterns: [
        {
          from: '**/*',
          context: 'example/public',
        },
      ]
    })
  ],

};