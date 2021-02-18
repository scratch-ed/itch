'use strict';

const path = require('path');
const pack = require('./package.json');
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// Common config for web & node.
const base = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  devServer: {
    contentBase: false,
    host: '0.0.0.0',
    port: process.env.PORT || 8361
  },
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        include: [
          path.resolve(__dirname, 'src'),
          /node_modules[\\/]scratch-[^\\/]+[\\/]src/,
        ],
        test: /\.js$/,
        loader: 'babel-loader'
      }
    ]
  }
};

module.exports = [
  // Web-compatible
  Object.assign({}, base, {
    target: 'web',
    entry: {
      'itch-core': './src/index.cjs'
    },
    output: {
      library: 'itch-core',
      libraryTarget: 'umd',
      path: path.resolve(path.dirname(pack.browser)),
      filename: path.basename(pack.browser)
    },
    externals: {
      'scratch-vm': 'root VirtualMachine',
      'scratch-storage': 'root ScratchStorage',
      'scratch-svg-renderer': 'root ScratchSVGRenderer',
      'scratch-render': 'root ScratchRender'
    }
  }),
  // Node-compatible
  // Object.assign({}, base, {
  //   target: 'node',
  //   entry: {
  //     'itch-core': './src/evaluation.js'
  //   },
  //   output: {
  //     library: 'itch-core',
  //     libraryTarget: 'commonjs2',
  //     path: path.resolve(path.dirname(pack.main)),
  //     filename: path.basename(pack.main)
  //   },
  //   externals: {
  //     '!ify-loader!grapheme-breaker': 'grapheme-breaker',
  //     '!ify-loader!linebreak': 'linebreak',
  //     'hull.js': true,
  //     'twgl.js': true,
  //     'xml-escape': true
  //   }
  // })
];