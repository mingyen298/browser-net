'use strict';

const path = require('path')

const PATHS = {
  src: path.resolve(__dirname, '../src'),
  build: path.resolve(__dirname, '../build'),
  test_build: path.resolve(__dirname, '../test/build'),
  test_src: path.resolve(__dirname, '../test/src'),
  example_build: path.resolve(__dirname, '../example/build'),
  example_src: path.resolve(__dirname, '../example/src'),
};



module.exports = {PATHS}
