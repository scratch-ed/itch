import { rollup } from 'rollup';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

async function transform(source, filename) {
  const { generate } = await rollup({
    input: filename,
    plugins: [
      resolve(),
      commonjs()
    ]
  });
  const { output } = await generate({
    format: 'cjs',
    sourcemap: true
  });
  return {
    code: output[0].code,
    map: output[0].map
  };
}

const { source, filename } = process.env;

transform(source, filename)
  .then(r => { process.stdout.write(JSON.stringify(r)); });
