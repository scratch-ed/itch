const { runJudge } = require('itch-runner');
const { PassThrough } = require('stream');
const parseCommands = require('../../utils/parseCommands');

const testStream = async (res, { testplan, templateFile, testFile, page }) => {
  res.setHeader('Content-Type', 'application/octet-stream');

  const pass = new PassThrough();
  pass.pipe(res);

  try {
    await runJudge({
      testplan: { content: testplan },
      template: templateFile.path,
      solution: testFile.path,
      page,
      out: (judgeObject) =>
        parseCommands(judgeObject, {
          onChunkFinished: (chunk) => {
            pass.write(`${JSON.stringify(chunk)};`);
            pass.resume();
          },
          onError: () => pass.end(),
        }),
    });
  } catch (err) {
    console.error(err);
  }

  pass.end();
};

module.exports = testStream;
