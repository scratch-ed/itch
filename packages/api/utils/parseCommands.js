const COMMANDS = Object.fromEntries(
  Object.keys(require('../../../utils/dodona-schema').definitions).map(
    (key) => [[key.toUpperCase().replace('-', '_')], key],
  ),
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

let context = {
  title: '',
  testCases: [],
};
let testCase = {
  description: '',
  status: {},
};

const parseCommands = (judgeObject, { onChunkFinished, onError }) => {
  if (!ALLOWED_COMMANDS.includes(judgeObject.command)) {
    return;
  }

  if (
    judgeObject.command === COMMANDS.ESCALATE_STATUS &&
    judgeObject.status.enum === 'runtime error'
  ) {
    onError();
  }

  // create new context with title
  if (judgeObject.command === COMMANDS.START_CONTEXT) {
    context.title = judgeObject.description;
  }

  // write context to stream and create new
  if (judgeObject.command === COMMANDS.CLOSE_CONTEXT) {
    onChunkFinished(context);
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
};

module.exports = parseCommands;
