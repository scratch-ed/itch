// const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

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
          /node_modules[\\/]pify/,
          /node_modules[\\/]@vernier[\\/]godirect/
        ],
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          // Explicitly disable babelrc so we don't catch various config
          // in much lower dependencies.
          babelrc: false,
          plugins: [
            '@babel/plugin-syntax-dynamic-import',
            '@babel/plugin-transform-async-to-generator',
            '@babel/plugin-proposal-object-rest-spread',
            ],
          presets: ['@babel/preset-env']
        }
      }
    ]
  },
  plugins: []
};

module.exports = [
  // Web-compatible
  Object.assign({}, base, {
    target: 'web',
    entry: {
      'itch-core': './src/evaluation.js'
    },
    output: {
      library: 'itch-core',
      libraryTarget: 'umd',
      path: path.resolve('dist', 'web'),
      filename: '[name].js'
    }
  }),
  // Node-compatible
  Object.assign({}, base, {
    target: 'node',
    entry: {
      'itch-core': './src/evaluation.js'
    },
    output: {
      library: 'itch-core',
      libraryTarget: 'commonjs2',
      path: path.resolve('dist', 'node'),
      filename: '[name].js'
    },
    externals: {
      '!ify-loader!grapheme-breaker': 'grapheme-breaker',
      '!ify-loader!linebreak': 'linebreak',
      'hull.js': true,
      'twgl.js': true,
      'xml-escape': true
    }
  })
];