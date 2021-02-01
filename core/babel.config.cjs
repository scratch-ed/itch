'use strict';

module.exports = {
  plugins: [
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-transform-async-to-generator',
    '@babel/plugin-proposal-object-rest-spread',
    'lodash'
  ],
  presets: [
    ['@babel/preset-env', {
      targets: {
        browsers: [
          'last 3 versions'
        ],
        node: 'current'
      }
    }]
  ]
};