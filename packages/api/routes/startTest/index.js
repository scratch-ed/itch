const { runJudge } = require('itch-runner');

const parseCommands = require('../../utils/parseCommands');

const test = async (req, reply, next, browser) => {
  const { testplan, sessionId } = req.body;
  const { templateFile, testFile } = req.files;

  const page = await browser.newPage();

  reply.send(sessionId);
  next();

  const output = [];
  let error;

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

    error = err;
  }

  await page.close();

  const data = { sessionId, output, error };

  fetch(`${process.env.JUDGE_SERVICE_PATH}/return-test`, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

module.exports = test;
