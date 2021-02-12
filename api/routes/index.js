const { PassThrough } = require('stream');
const { Judge } = require('../../judge');

const COMMANDS = Object.fromEntries(
  Object.keys(require('../../utils/dodona-schema').definitions).map((key) => [
    [key.toUpperCase().replace('-', '_')],
    key,
  ]),
);

const ALLOWED_COMMANDS = [
  COMMANDS.START_TAB,
  COMMANDS.START_TESTCASE,
  COMMANDS.CLOSE_TEST,
  COMMANDS.CLOSE_TESTCASE,
  COMMANDS.CLOSE_TAB,
];

function setupRoutes(server) {
  server.post('/test', async (req, res, next) => {
    const { testplan } = req.body;
    const { templateFile, testFile } = req.files;

    res.setHeader('Content-Type', 'text/plain');

    const pass = new PassThrough();
    pass.pipe(res);
    
    const plan = {
      content: testplan.toString()
    }

    const judge = new Judge(plan, { fromApi: true }, (judgeObject) => {
      if (!ALLOWED_COMMANDS.includes(judgeObject.command)) {
        return;
      }

      pass.write(JSON.stringify(judgeObject));
      pass.resume();
    });

    await judge.run(templateFile.path, testFile.path);

    pass.end();
    next();
  });
}

module.exports = setupRoutes;
