'use strict';

const path = require('path');
const pack = require('./package.json');
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = [
  // Web-compatible
  {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    devServer: {
      contentBase: false,
      host: '0.0.0.0',
      port: process.env.PORT || 8361
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          include: [path.resolve(__dirname, 'src')],
          test: /\.js$/,
          loader: 'babel-loader'
        }
      ]
    },
    target: 'web',
    entry: {
      'itch-core': './src/index.cjs'
    },
    output: {
      library: 'itch-core',
      libraryTarget: 'umd',
      path: path.resolve(path.dirname(pack.main)),
      filename: path.basename(pack.main)
    },
    externals: {
      'scratch-vm': 'root VirtualMachine',
      'scratch-storage': 'root ScratchStorage',
      'scratch-svg-renderer': 'root ScratchSVGRenderer',
      'scratch-render': 'root ScratchRender'
    }
  }
];