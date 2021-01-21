import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import pkg from './package.json';

export default [
  {
    input: 'src/judge.js',
    output: [
      {
        name: 'itch-judge',
        file: pkg.browser,
        format: 'umd',
        sourcemap: 'inline'
      }, {
        file: pkg.main,
        format: 'cjs',
        sourcemap: 'inline'
      }, {
        file: pkg.module,
        format: 'es',
        sourcemap: 'inline'
      }
    ],
    plugins: [
      resolve(),
      commonjs()
    ]
  }
];
