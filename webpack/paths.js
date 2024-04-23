'use strict';

const path = require('path')

const PATHS = {
  src: path.resolve(__dirname, '../src'),
  build: path.resolve(__dirname, '../build'),
  test_build: path.resolve(__dirname, '../test/build'),
  test_src: path.resolve(__dirname, '../test/src'),
};



module.exports = {PATHS}
