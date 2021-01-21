const { execSync } = require('child_process');

function fixFilenames(file) {
  return '../' + file;
}

module.exports = {
  process(src, filename) {
    const str = execSync(
      'node --unhandled-rejections=strict --abort-on-uncaught-exception ./cli.js',
      { env: { ...process.env, src, filename } }
    ).toString();

    const obj = JSON.parse(str);
    obj.map.sources = obj.map.sources.map(fixFilenames);
    return obj;
  }
};
