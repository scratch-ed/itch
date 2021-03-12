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
 * @typedef {Object} Status
 * @property {string} human
 * @property {"time limit exceeded"|"runtime error"|"wrong"|"correct"} enum
 */

/** @type {Status} */
export const CORRECT = { enum: 'correct', human: 'Correct' };
/** @type {Status} */
export const WRONG = { enum: 'wrong', human: 'Wrong' };

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
    this.hasOpenJudgement = false;
    this.hasOpenTab = false;
    this.hasOpenContext = false;
    this.hasOpenCase = false;
    this.hasOpenTest = false;
    this.isFinished = false;
  }

  /**
   * Start the judgement.
   */
  startJudgement() {
    if (this.isFinished) {
      console.warn('Attempting to start judgement after judgement has been completed. Ignoring.');
      return;
    }
    this.out({ command: 'start-judgement' });
    this.hasOpenJudgement = true;
  }

  /**
   * Close the judgement. This will finish the judge, meaning all future
   * output is ignored.
   *
   * @param {boolean} [accepted] - If the judgement is accepted or not.
   */
  closeJudgement(accepted = undefined) {
    console.warn("Closing judgement...");
    if (this.isFinished) {
      console.warn('Attempting to close judgement after judgement has been completed. Ignoring.');
      return;
    }
    if (!this.hasOpenJudgement) {
      console.warn('Attempting to close judgement while none is open. Ignoring.');
      return;
    }
    if (this.hasOpenContext) {
      this.closeContext();
    }

    if (typeof accepted === 'undefined') {
      this.out({ command: 'close-judgement' });
    } else {
      this.out({
        command: 'close-judgement',
        accepted: accepted,
        status: accepted ? CORRECT : WRONG,
      });
    }

    this.hasOpenJudgement = false;
    this.isFinished = true;
  }

  /**
   * Start a tab.
   *
   * @param {string} title
   * @param {boolean} [hidden]
   */
  startTab(title, hidden = undefined) {
    if (this.isFinished) {
      console.warn('Attempting to open tab after judgement has been completed. Ignoring.');
      return;
    }
    if (!this.hasOpenJudgement) {
      this.hasOpenJudgement();
    }
    if (this.hasOpenTab) {
      this.closeTab();
    }
    this.out({ command: 'start-tab', title: title, hidden: hidden });
    this.hasOpenTab = true;
  }

  /**
   * Close a tab.
   */
  closeTab() {
    if (this.isFinished) {
      console.warn('Attempting to close tab after judgement has been completed. Ignoring.');
      return;
    }
    if (!this.hasOpenTab) {
      console.warn('Attempting to close tab while none is open. Ignoring.');
      return;
    }
    if (this.hasOpenContext) {
      this.closeContext();
    }
    this.out({ command: 'close-tab' });
    this.hasOpenTab = false;
  }

  /**
   * Start a context. This will initialise other levels if needed.
   *
   * @param {string} [description] - Optional description of the context.
   */
  startContext(description = undefined) {
    if (this.isFinished) {
      console.warn('Attempting to start context after judgement has been completed.');
      return;
    }
    if (this.hasOpenContext) {
      this.closeContext();
    }
    if (!this.hasOpenTab) {
      this.startTab(description || 'Tab');
    }
    this.out({ command: 'start-context', description: description });
    this.hasOpenContext = true;
  }

  /**
   * Close a context.
   *
   * @param {boolean} [accepted]
   */
  closeContext(accepted = undefined) {
    if (this.isFinished) {
      console.warn('Attempting to close context after judgement has been completed.');
      return;
    }
    if (!this.hasOpenContext) {
      console.warn('Attempting to close context while none is open. Ignoring.');
      return;
    }
    if (this.hasOpenCase) {
      this.closeTestcase();
    }
    this.out({ command: 'close-context', accepted: accepted });
    this.hasOpenContext = false;
  }

  /**
   * Start a testcase. This will initialise other levels if needed.
   *
   * @param {string} [description] - Optional description of the context.
   */
  startTestcase(description = undefined) {
    if (this.isFinished) {
      console.warn('Attempting to start testcase after judgement has been completed.');
      return;
    }
    if (this.hasOpenCase) {
      this.closeTestcase();
    }
    if (!this.hasOpenContext) {
      this.startContext(description);
    }
    this.out({ command: 'start-testcase', description: description });
    this.hasOpenCase = true;
  }

  /**
   * @param {boolean} [accepted]
   */
  closeTestcase(accepted = undefined) {
    if (this.isFinished) {
      console.warn('Attempting to close testcase after judgement has been completed.');
      return;
    }
    if (!this.hasOpenCase) {
      console.warn('Attempting to close testcase while none is open. Ignoring.');
      return;
    }
    if (this.hasOpenTest) {
      this.closeTest(undefined, accepted);
    }
    this.out({ command: 'close-testcase', accepted: accepted });
    this.hasOpenCase = false;
  }

  /**
   * @param {any} expected
   * @param {string} [description]
   */
  startTest(expected, description = undefined) {
    if (this.isFinished) {
      console.warn('Attempting to start test after judgement has been completed.');
      return;
    }
    if (this.hasOpenTest) {
      this.closeTest(undefined, false);
    }
    if (!this.hasOpenCase) {
      this.startTestcase(description);
    }
    this.out({ command: 'start-test', expected: expected?.toString(), description: description });
    this.hasOpenTest = true;
  }

  /**
   * @param {any} generated
   * @param {boolean} accepted
   * @param {Status} [status]
   */
  closeTest(generated, accepted, status = undefined) {
    if (this.isFinished) {
      console.warn('Attempting to close test after judgement has been completed.');
      return;
    }
    if (!this.hasOpenTest) {
      console.warn('Attempting to close test while none is open. Ignoring.');
      return;
    }
    this.out({
      command: 'close-test',
      generated: generated?.toString(),
      accepted: accepted,
      status: status || (accepted ? CORRECT : WRONG),
    });
    this.hasOpenTest = false;
  }

  /**
   * @param {string} message
   */
  appendMessage(message) {
    this.out({ command: 'append-message', message: message });
  }

  /**
   * @param {Status} status
   */
  escalateStatus(status) {
    this.out({ command: 'escalate-status', status: status });
  }
}
