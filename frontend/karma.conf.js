var webpack = require('webpack');
var webpack_config = require('./webpack.config.js');

module.exports = function (config) {
  config.set({
    basePath: "./",
    browsers: [ 'Chrome', 'Firefox' ], //run in Chrome
    singleRun: true, //just run once by default
    frameworks: [ 'mocha', 'chai' ], //use the mocha test framework
    client: {
      mocha: {
        grep: '/.*Test.js[x]{0,1}/',
        compilers: 'jsx:babel-core/register',
      }
    },
    files: [
      'test/mocha/dom-mock.js',
      'tests.webpack.js' //just load this file
    ],
    plugins: [ 'karma-chrome-launcher', 'karma-chai', 'karma-mocha',
      'karma-sourcemap-loader', 'karma-webpack', 'karma-coverage',
      'karma-mocha-reporter', 'babel-core', 'babel-loader'
    ],
    preprocessors: {
      'tests.webpack.js': [ 'babel-loader', 'webpack', 'sourcemap' ] //preprocess with webpack and our sourcemap loader
    },
    reporters: [ 'mocha', 'coverage' ], //report results in this format
    webpack: webpack_config,
    webpackServer: {
      noInfo: true //please don't spam the console when running in karma!
    },
    coverageReporter: {
      type: 'html', //produces a html document after code is run
      dir: 'coverage/' //path to created html doc
    }
  });
};
