'use strict';

module.exports = {
  plugins: ['plugins/markdown'],
  source: {
    include: ['src']
  },
  opts: {
    destination: 'dist/docs',
    readme: 'README.md',
    recurse: true
  }
};