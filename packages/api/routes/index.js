const { PassThrough } = require('stream');
const { Judge } = require('itch-runner');

const COMMANDS = Object.fromEntries(
  Object.keys(
    require('../../../utils/dodona-schema').definitions,
  ).map((key) => [[key.toUpperCase().replace('-', '_')], key]),
);

const ALLOWED_COMMANDS = [
  COMMANDS.START_TESTCASE,
  COMMANDS.CLOSE_TEST,
  COMMANDS.CLOSE_TESTCASE,
  COMMANDS.CLOSE_TAB,
  COMMANDS.START_CONTEXT,
  COMMANDS.CLOSE_CONTEXT,
  COMMANDS.APPEND_MESSAGE,
  COMMANDS.ESCALATE_STATUS,
];

function setupRoutes(server) {
  server.post('/test', async (req, res, next) => {
    const { testplan } = req.body;
    const { templateFile, testFile } = req.files;

    res.setHeader('Content-Type', 'text/plain');

    const pass = new PassThrough();
    pass.pipe(res);

    let context = {
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
        console.log(judgeObject);
        if (!ALLOWED_COMMANDS.includes(judgeObject.command)) {
          return;
        }

        if (
          judgeObject.command === COMMANDS.ESCALATE_STATUS &&
          judgeObject.status.enum === 'runtime error'
        ) {
          pass.end();
        }

        // create new context with title
        if (judgeObject.command === COMMANDS.START_CONTEXT) {
          context.title = judgeObject.description;
        }

        // write context to stream and create new
        if (judgeObject.command === COMMANDS.CLOSE_CONTEXT) {
          pass.write(`${JSON.stringify(context)};`);
          pass.resume();
          context = { title: '', testCases: [] };
        }

        // creation of a new testcase
        if (judgeObject.command === COMMANDS.START_TESTCASE) {
          testCase.description = judgeObject.description;
        }

        if (judgeObject.command === COMMANDS.APPEND_MESSAGE) {
          testCase.message = judgeObject.message;
        }

        // add the status object
        if (judgeObject.command === COMMANDS.CLOSE_TEST) {
          // if a subtest was previously false, show that one
          const isPreviousSubtestCorrect = testCase.status?.enum !== 'wrong';

          testCase.status = isPreviousSubtestCorrect
            ? judgeObject.status
            : testCase.status;
        }

        // push the testcase in the context
        if (judgeObject.command === COMMANDS.CLOSE_TESTCASE) {
          context.testCases.push(testCase);
          testCase = {};
        }
      },
    );

    try {
      await judge.run(templateFile.path, testFile.path);
    } catch (err) {
      console.error(err);
    }

    next();
    pass.end();
  });
}

module.exports = setupRoutes;
