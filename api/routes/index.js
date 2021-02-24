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

    let tab = {
      title: '',
      testCases: [],
    };
    let testCase = {
      description: '',
      status: {},
    };

    const judge = new Judge(
      testplan,
      { fromApi: true, debug: false },
      (judgeObject) => {
        if (!ALLOWED_COMMANDS.includes(judgeObject.command)) {
          return;
        }

        // create new tab with title
        if (judgeObject.command === COMMANDS.START_TAB) {
          tab.title = judgeObject.title;
        }

        // write tab to stream and create new
        if (judgeObject.command === COMMANDS.CLOSE_TAB) {
          pass.write(`${JSON.stringify(tab)};`);
          pass.resume();
          tab = { title: '', testCases: [] };
        }

        // creation of a new testcase
        if (judgeObject.command === COMMANDS.START_TESTCASE) {
          testCase.description = judgeObject.description;
        }

        // add the status object
        if (judgeObject.command === COMMANDS.CLOSE_TEST) {
          testCase.status = judgeObject.status;
        }

        // push the testcase in the tab
        if (judgeObject.command === COMMANDS.CLOSE_TESTCASE) {
          tab.testCases.push(testCase);
          testCase = {};
        }
      },
    );

    await judge.run(templateFile.path, testFile.path);

    pass.end();
    next();
  });
}

module.exports = setupRoutes;
