/**
 * Handle outputting. By default, all output is sent to stderr.
 */
function toOutput(output) {
  if (typeof window.handleOut !== 'undefined') {
    window.handleOut(output);
  } else {
    console.log(output);
  }
}

/**
 * Manage the pout
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

  startTestContext() {
    if (!this.hasOpenTab) {
      this.startTestTab('Tests');
    }
    this.out({ command: 'start-context' });
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
      this.startTestContext();
    }
    if (this.hasOpenCase) {
      this.closeTestCase(true);
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

  addTest(testName, expected, generated, message, correct = null) {
    let status;
    this.startTestCase(testName);
    this.startTest(expected);
    if (generated !== undefined) {
      if (generated === expected) {
        status = { enum: 'correct', human: 'Correct' };
      } else {
        this.addMessage(message);
        status = { enum: 'wrong', human: 'Fout' };
      }
    } else {
      status = { enum: 'runtime error', human: 'Error: resultaat is undefined' };
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
    this.closeTestCase();
  }

  /**
   * Add a complete testcase to the output.
   * 
   * // TODO: change this output format to better use the Dodona format.
   * 
   * @param {string} caseName - The name of the testcase.
   * @param {boolean} correct - If the testcase was successful or not.
   * @param {string} message - The message if wrong.
   */
  addCase(caseName, correct, message = 'Verkeerd') {
    this.startTestCase(caseName);
    if (!correct) {
      this.addMessage(message);
    }
    this.closeTestCase(correct);
  }

}