const { runJudge } = require('@ftrprf/judge-runner');
const fetch = require('node-fetch');

const parseCommands = require('../../utils/parseCommands');

const test = async (req, reply, next, browser) => {
  const { testplan, sessionId } = req.body;
  const { templateFile, testFile } = req.files;

  const page = await browser.newPage();

  reply.send(sessionId);
  next();

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

    console.log(`Result for ${sessionId}: ${output}`);

    fetch(`${process.env.JUDGE_SERVICE_NOTIFY_URL}/${sessionId}`, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(output),
    });
  } catch (err) {
    console.log(err);

    fetch(`${process.env.JUDGE_SERVICE_NOTIFY_ERROR_URL}/${sessionId}`, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(error),
    });
  }

  await page.close();
};

module.exports = test;
