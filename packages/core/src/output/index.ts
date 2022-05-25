/**
 * @fileOverview A way to group tests in a flexible hierarchy. In the long term,
 *   this will replace the existing groups.
 */

import { Status, Update, Visibility } from './partial-schema';

/**
 * Handle outputting. By default, all output is sent to stderr.
 * You can overwrite this by setting a global `handleOut` callback,
 * which will be used instead if present.
 */
function toOutput(output: Update): void {
  // @ts-ignore
  if (typeof window.handleOut !== 'undefined') {
    // @ts-ignore
    window.handleOut(output);
  } else {
    console.log(output);
  }
}

export interface OutputHandler {
  (obj: Update): void;
}

export class GroupedResultManager {
  private readonly out: OutputHandler;
  private hasOpenJudgement = false;
  private openGroups = 0;
  private hasOpenTest = false;
  private isFinished = false;
  private escalation?: Status;
  private testNumber = 0;

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
   * @param [visibility] Default visibility of the group. If an error occurs, the
   *        group must always be shown.
   * @param [tags] Optional tags for this group.
   * @param [sprite] Name of optionally linked sprite.
   */
  startGroup(
    name: string,
    visibility: Visibility = 'show',
    tags: string[] = [],
    sprite?: string,
  ): void {
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
    this.out({
      command: 'start-group',
      name: name,
      sprite: sprite,
      visibility: visibility,
      tags: tags,
    });
  }

  /**
   * Close a group.
   *
   * @param summary
   */
  closeGroup(summary?: string): void {
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
    this.out({ command: 'close-group', summary: summary });
  }

  startTest(name?: string, tags: string[] = []): void {
    if (name === undefined) {
      name = `Test ${this.testNumber++}`;
    }
    if (this.isFinished) {
      console.warn('Attempting to start test after judgement has been completed.');
      return;
    }
    if (this.hasOpenTest) {
      console.warn(
        'Attempting to start new test while open test exists, closing it as wrong.',
      );
      this.closeTest('wrong');
    }
    if (this.openGroups <= 0) {
      console.warn('Attempting to start test while no group is open.');
      this.startGroup(`Groep ${Math.random()}`);
    }
    this.out({
      command: 'start-test',
      name: name,
      tags: tags,
    });
    this.hasOpenTest = true;
  }

  closeTest(status: Status, feedback?: string): void {
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
      feedback: feedback,
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

  appendDiff(expected: string, actual = 'null'): void {
    if (!this.hasOpenTest) {
      console.warn('Attempting to append diff while no test is open. Ignoring.');
      return;
    }
    this.out({ command: 'append-diff', expected: expected, actual: actual });
  }

  escalateStatus(status: Status): void {
    if (!this.hasOpenJudgement) {
      console.warn('Attempting to escalate status of closed judgement. Ignoring.');
      return;
    }
    this.escalation = status;
    this.out({ command: 'escalate-status', status: status });
  }
}

/** @deprecated */
export class ResultManager {
  /** @deprecated */
  constructor(private readonly grouped: GroupedResultManager) {}

  /** @deprecated */
  startContext(description?: string): void {
    this.grouped.startGroup(description ?? 'Unnamed context');
  }

  /** @deprecated */
  closeContext(): void {
    this.grouped.closeGroup();
  }

  /** @deprecated */
  startTestcase(description?: string): void {
    this.grouped.startGroup(description ?? 'Testcase');
  }

  /** @deprecated */
  appendMessage(message: string): void {
    this.grouped.appendMessage(message);
  }

  /** @deprecated */
  escalateStatus(status: Status): void {
    this.grouped.escalateStatus(status);
  }
}
