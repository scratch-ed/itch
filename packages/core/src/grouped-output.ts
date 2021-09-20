/**
 * @fileOverview A way to group tests in a flexible hierarchy. In the long term,
 *   this will replace the existing groups.
 */

/**
 * Handle outputting. By default, all output is sent to stderr.
 * You can overwrite this by setting a global `handleOut` callback,
 * which will be used instead if present.
 */
function toOutput(output: Record<string, unknown>): void {
  // @ts-ignore
  if (typeof window.handleOut !== 'undefined') {
    // @ts-ignore
    window.handleOut(output);
  } else {
    console.log(output);
  }
}

export enum Status {
  TimeLimit = 'time limit exceeded',
  Runtime = 'runtime error',
  Wrong = 'wrong',
  Correct = 'correct',
}

export enum Format {
  Text = 'text',
  Html = 'html',
}

export interface OutputHandler {
  (obj: Record<string, unknown>): void;
}

export interface Message {
  format: Format;
  description: string;
}

export enum Visibility {
  Show = 'show',
  Collapse = 'collapse',
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
export class GroupedResultManager {
  private readonly out: OutputHandler;
  private hasOpenJudgement = false;
  private openGroups = 0;
  private hasOpenTest = false;
  private isFinished = false;
  private escalation?: Status;

  constructor(out: OutputHandler = toOutput) {
    this.out = out;
  }

  /**
   * Start the judgement.
   */
  startJudgement(): void {
    if (this.isFinished) {
      console.warn(
        'Attempting to start judgement after judgement has been completed. Ignoring.',
      );
      return;
    }
    this.out({ command: 'start-judgement', version: 2 });
    this.hasOpenJudgement = true;
  }

  /**
   * Close the judgement. This will finish the judge, meaning all future
   * output is ignored.
   */
  closeJudgement(): void {
    if (this.isFinished) {
      console.warn(
        'Attempting to close judgement after judgement has been completed. Ignoring.',
      );
      return;
    }
    if (!this.hasOpenJudgement) {
      console.warn('Attempting to close judgement while none is open. Ignoring.');
      return;
    }
    while (this.openGroups > 0) {
      console.warn('Unclosed groups, force closing them...');
      this.closeGroup();
    }
    this.out({ command: 'close-judgement' });
    this.hasOpenJudgement = false;
    this.isFinished = true;
  }

  /**
   * Start a new test group.
   *
   * Each group needs a name, which is user visible. You can also optionally
   * provide the name of a sprite, which allows for a better display, for
   * example by showing the sprite or linking to it. You must use the sprite's
   * name.
   *
   * @param name Name of the test group.
   * @param [sprite] Name of optionally linked sprite.
   */
  startGroup(name: string, sprite?: string): void {
    if (this.isFinished) {
      console.warn(
        'Attempting to open group after judgement has been completed. Ignoring.',
      );
      return;
    }
    if (!this.hasOpenJudgement) {
      this.startJudgement();
    }
    this.openGroups++;
    this.out({ command: 'start-group', name: name, sprite: sprite });
  }

  /**
   * Close a group.
   *
   * @param summary
   * @param visibility
   */
  closeGroup(summary?: string | Message, visibility: Visibility = Visibility.Show): void {
    if (this.isFinished) {
      console.warn(
        'Attempting to close group after judgement has been completed. Ignoring.',
      );
      return;
    }
    if (this.openGroups <= 0) {
      console.warn('Attempting to close tab while none is open. Ignoring.');
      return;
    }

    this.openGroups--;
    this.out({ command: 'close-group', summary: summary, visibility: visibility });
  }

  startTest(name = `Test ${Math.random()}`): void {
    if (this.isFinished) {
      console.warn('Attempting to start test after judgement has been completed.');
      return;
    }
    if (this.hasOpenTest) {
      console.warn(
        'Attempting to start new test while open test exists, closing it as wrong.',
      );
      this.closeTest(Status.Wrong);
    }
    if (this.openGroups <= 0) {
      console.warn('Attempting to start test while no group is open.');
      this.startGroup(`Groep ${Math.random()}`);
    }
    this.out({
      command: 'start-test',
      name: name,
    });
    this.hasOpenTest = true;
  }

  closeTest(status: Status, description?: string): void {
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
      status: status,
      description: description,
    });
    this.hasOpenTest = false;
  }

  appendMessage(message: string): void {
    if (!this.hasOpenJudgement) {
      console.warn('Attempting to append message while no judgement is open. Ignoring.');
      return;
    }
    this.out({ command: 'append-message', message: message });
  }

  appendDiff(expected: string, actual: string | null = null): void {
    if (!this.hasOpenTest) {
      console.warn('Attempting to append diff while no test is open. Ignoring.');
      return;
    }
    this.out({ command: 'append-diff', expected: expected, actual: actual });
  }

  escalateStatus(status: Status | string): void {
    if (!this.hasOpenJudgement) {
      console.warn('Attempting to escalate status of closed judgement. Ignoring.');
      return;
    }
    this.escalation = status as Status;
    this.out({ command: 'escalate-status', status: status });
  }

  whyEscalate(): Status | undefined {
    return this.escalation;
  }
}
