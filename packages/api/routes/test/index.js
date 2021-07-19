const { runJudge } = require('@ftrprf/judge-runner');
const testStream = require('./stream');

const parseCommands = require('../../utils/parseCommands');

const test = async (req, reply, next, browser) => {
  const { testplan } = req.body;
  const { templateFile, testFile } = req.files;
  const { accept } = req.headers;

  const page = await browser.newPage();

  // stream mode
  if (accept === 'application/octet-stream') {
    await testStream(reply, { testplan, templateFile, testFile, page });
    await page.close();
    next();
  }

  const output = [];

  try {
    await runJudge({
      testplan: { content: testplan },
      template: templateFile.path,
      solution: testFile.path,
      page,
      out: (judgeObject) =>
        parseCommands(judgeObject, {
          onChunkFinished: (chunk) => {
            output.push(chunk);
          },
          onError: () => {
            throw new Error(
              'the judge internally failed, check the logs for more information',
            );
          },
        }),
    });
  } catch (err) {
    console.log(err);

    reply.code(500).send(err);
  }

  await page.close();
  reply.send(output);
  next();
};

module.exports = test;
