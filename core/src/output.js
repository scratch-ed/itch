import isEqual from 'lodash/isEqual';

/**
 * Handle outputting. By default, all output is sent to stderr.
 * 
 * @private
 */
function toOutput(output) {
  if (typeof window.handleOut !== 'undefined') {
    window.handleOut(output);
  } else {
    console.log(output);
  }
}

/**
 * Manages the output for the Dodona-inspired format.
 * 
 * While this class is exposed in testplans, in most cases
 * you should use the high-level testplan API instead of this one.
 * 
 * ### Dodona format
 * 
 * Some more information on the Dodona format. The format is a partial format.
 * The judge basically sends updates to the test result state via commands, e.g.
 * "start testcase X", "start test Y", "close testcase X", etc.
 * 
 * For ease of use, the result manager will automatically open higher levels when
 * opening lower levels. For example, if you open a testcase without opening a
 * context first, the result manager will do so for you. Previous levels are also
 * closed when appropriate. For example, when starting a new tab, all previous tabs
 * will be closed.
 * 
 * There is one exception: a test. If an open test is detected, an error will be thrown,
 * as the result manager has no way of knowing if the test is successful or not.
 */
export default class ResultManager {
  constructor() {
    this.out = toOutput;
    this.hasOpenTab = false;
    this.hasOpenContext = false;
    this.hasOpenCase = false;
    this.hasOpenTest = false;
  }

  addMessage(message) {
    this.out({ command: 'append-message', message: message });
  }

  startTestTab(name) {
    if (this.hasOpenTab) {
      this.closeTestTab();
    }
    this.out({ command: 'start-tab', title: name });
    this.hasOpenTab = true;
  }

  closeTestTab() {
    if (this.hasOpenContext) {
      this.closeTestContext();
    }
    this.out({ command: 'close-tab' });
    this.hasOpenTab = false;
  }

  startTestContext(description = null) {
    if (description) {
      this.out({ command: 'start-context', description: description });
    } else {
      this.out({ command: 'start-context' });
    }
    this.hasOpenContext = true;
  }

  closeTestContext() {
    if (this.hasOpenCase) {
      this.closeTestCase();
    }
    this.out({ command: 'close-context' });
    this.hasOpenContext = false;
  }

  startTestCase(description) {
    if (!this.hasOpenContext) {
      this.startTestContext(description);
    }
    if (this.hasOpenCase) {
      this.closeTestCase();
    }
    this.out({ command: 'start-testcase', description: description });
    this.hasOpenCase = true;
  }

  closeTestCase(accepted = undefined) {
    if (accepted !== null && accepted !== undefined && accepted !== true) {
      this.out({ command: 'start-test', expected: 'true' });
      let status;
      if (accepted) {
        status = { enum: 'correct', human: 'Correct' };
      } else {
        status = { enum: 'wrong', human: 'Wrong' };
      }
      this.out({
        command: 'close-test',
        generated: accepted.toString(),
        status: status,
      });
      this.out({ command: 'close-testcase' });
    } else {
      this.out({ command: 'close-testcase' });
    }
    this.hasOpenCase = false;
  }

  startTest(expected) {
    if (!this.hasOpenCase) {
      this.startTestCase();
    }
    this.out({ command: 'start-test', expected: expected.toString() });
    this.hasOpenTest = true;
  }

  closeTest(generated, status) {
    this.out({
      command: 'close-test',
      generated: generated?.toString(),
      status: status,
    });
    this.hasOpenTest = false;
  }

  /** @deprecated */
  addError(error) {
    this.addMessage(error);
    if (this.hasOpenTest) {
      this.closeTest(null, { enum: 'wrong', human: 'Fout' });
    }
    if (this.hasOpenCase) {
      this.closeTestCase();
    }
    if (this.hasOpenContext) {
      this.closeTestContext();
    }
    if (this.hasOpenTab) {
      this.closeTestTab();
    }
    this.closeJudge(false);
  }

  closeJudge(accepted = undefined) {
    if (accepted !== null && accepted !== undefined) {
      this.out({ command: 'close-judgement' });
    } else {
      let status = {};
      if (accepted) {
        status = { enum: 'correct', human: 'Correct' };
      } else {
        status = { enum: 'wrong', human: 'Wrong' };
      }
      this.out({
        command: 'close-judgement',
        accepted: accepted?.toString(),
        status: status,
      });
    }
  }

  annotate(row, column, text) {
    this.out({
      command: 'annotate',
      row: row,
      column: column,
      text: text,
    });
  }

  /** @deprecated */
  addTest(testName, expected, generated, message, correct = null) {
    this.startTestCase(testName);
    this.addOneTest(expected, generated, message, correct);
    this.closeTestCase();
  }

  /** @deprecated */
  addOneTest(expected, generated, message, correct = null) {
    let status;
    this.startTest(expected);
    if (generated !== undefined) {
      if (isEqual(generated, expected)) {
        status = { enum: 'correct', human: 'Correct' };
      } else {
        this.addMessage(message);
        status = { enum: 'wrong', human: 'Fout' };
      }
    } else {
      status = {
        enum: 'runtime error',
        human: 'Error: resultaat is undefined',
      };
    }

    if (correct != null) {
      if (correct) {
        status = { enum: 'correct', human: 'Correct' };
      }
      if (!correct) {
        this.addMessage(message);
        status = { enum: 'wrong', human: 'Fout' };
      }
    }

    this.closeTest(generated, status);
  }

  /**
   * Add a complete testcase to the output.
   *
   * // TODO: change this output format to better use the Dodona format.
   *
   * @param {string} caseName - The name of the testcase.
   * @param {boolean} correct - If the testcase was successful or not.
   * @param {string} message - The message if wrong.
   * @deprecated
   */
  addCase(caseName, correct, message = 'Verkeerd') {
    this.startTestCase(caseName);
    if (!correct) {
      this.addMessage(message);
    }
    this.closeTestCase(correct);
  }
}
