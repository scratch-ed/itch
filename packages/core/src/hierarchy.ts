/**
 * @file This file contains the testplan API, i.e. most of the stuff
 * you use when writing a test plan. This API is inspired by Jest, so
 * if you are familiar, it should be fairly easy to pick up.
 *
 * ## Structure
 *
 * Itch provides 4 levels of groupings for tests:
 *
 * 1. `group`   -> a group in the output
 * 2. `test` -> a test in the output
 *
 * When starting from the bottom, we begin simple:
 *
 * 1. The `expect` is used to compare two values. It does not have a name itself,
 *    but you can provide a custom error message. This is only shown when the
 *    assertion fails. (The values are always passed as well).
 * 2. The `test` is the lowest level with a name. It groups a bunch of related
 *    `expect` statements.
 * 3. The `describe` directive groups a bunch of related tests, e.g. for one sprite.
 * 4. The `tab` groups a bunch of `describe` statements. These are mainly for UI purposes.
 */
import isEqual from 'lodash-es/isEqual';
import { castCallback, numericEquals, stringify } from './utils';
import { GroupedResultManager, Status, Visibility } from './grouped-output';

export class FatalErrorException extends Error {}

export class RuntimeException extends Error {}

interface OutputCallback {
  (accepted: boolean, expected?: unknown, actual?: unknown): void;
}

class Matcher {
  private readonly callback: OutputCallback;
  private readonly actual: unknown;

  constructor(callback: OutputCallback, actual: unknown) {
    this.callback = callback;
    this.actual = actual;
  }

  private accepted(expected: unknown): boolean {
    if (typeof this.actual === 'number' && typeof expected === 'number') {
      return numericEquals(this.actual, expected);
    } else {
      return isEqual(this.actual, expected);
    }
  }

  /**
   * Compares two values for equality.
   *
   * Most types of objects should be supported:
   *
   * - If both values are numbers, `numericEquals` is used, which supports floats.
   * - Otherwise, the `isEqual` function from lodash is used. Quoting their docs:
   *
   *   > This method supports comparing arrays, array buffers, booleans,
   *   > date objects, error objects, maps, numbers, `Object` objects, regexes,
   *   > sets, strings, symbols, and typed arrays. `Object` objects are compared
   *   > by their own, not inherited, enumerable properties. Functions and DOM
   *   > nodes are **not** supported.
   */
  toBe(expected: unknown): void {
    this.callback(this.accepted(expected), expected, this.actual);
  }

  /**
   * Compares two values for equality.
   *
   * Most types of objects should be supported:
   *
   * - If both values are numbers, `numericEquals` is used, which supports floats.
   * - Otherwise, the `isEqual` function from lodash is used. Quoting their docs:
   *
   *   > This method supports comparing arrays, array buffers, booleans,
   *   > date objects, error objects, maps, numbers, `Object` objects, regexes,
   *   > sets, strings, symbols, and typed arrays. `Object` objects are compared
   *   > by their own, not inherited, enumerable properties. Functions and DOM
   *   > nodes are **not** supported.
   */
  toNotBe(expected: unknown): void {
    this.callback(!this.accepted(expected), expected, this.actual);
  }
}

export type MessageCallback = (..._args: unknown[]) => string;

interface CorrectMessage {
  correct: string | MessageCallback;
  wrong?: string | MessageCallback;
}

interface WrongMessage {
  correct?: string | (() => string);
  wrong: string | (() => string);
}

export type Messages = CorrectMessage | WrongMessage;

class TestOptions {
  private errorMessage?: MessageCallback;
  private correctMessage?: MessageCallback;
  private terminate = false;
  private enableDiff = false;

  constructor(private readonly resultManager: GroupedResultManager) {}

  /**
   * Make this test fatal: if it fails, execution is stopped.
   */
  fatal(): TestOptions {
    this.terminate = true;
    return this;
  }

  /**
   * Enable the diff output.
   */
  diff(): TestOptions {
    this.enableDiff = true;
    return this;
  }

  /**
   * Execute the test.
   *
   * @param accepted - If the test is correct or not.
   */
  do(accepted: boolean): void {
    if (this.enableDiff) {
      throw new RuntimeException('Cannot request diff if no values are given.');
    }

    this.out(accepted);
  }

  /**
   * Execute the test with
   * @param actual
   */
  expect(actual: unknown): Matcher {
    // We pass a method, so set the "this" correctly.
    return new Matcher(this.out.bind(this), actual);
  }

  feedback(messages: Messages): TestOptions {
    this.correctMessage = castCallback(messages.correct);
    this.errorMessage = castCallback(messages.wrong);
    return this;
  }

  private out(accepted: boolean, expected?: unknown, actual?: unknown) {
    const status = accepted ? Status.Correct : Status.Wrong;
    const messageCallback = accepted ? this.correctMessage : this.errorMessage;
    const summary = messageCallback?.(expected, actual);

    if (this.enableDiff) {
      this.resultManager.appendDiff(stringify(expected), stringify(actual));
    }

    this.resultManager.closeTest(status, summary);

    if (!accepted && this.terminate) {
      throw new FatalErrorException();
    }
  }
}

export interface GroupOptions {
  sprite?: string;
  summary?: string;
  visibility?: Visibility | 'show' | 'collapse';
}

export interface SpriteGroupOptions extends GroupOptions {
  sprite: string;
}

export class GroupLevel {
  constructor(protected readonly resultManager: GroupedResultManager) {}

  /**
   * Start a test.
   * @param name - Optional name of the test.
   */
  test(name?: string): TestOptions {
    if (name) {
      this.resultManager.startTest(name);
    } else {
      this.resultManager.startTest();
    }

    return new TestOptions(this.resultManager);
  }

  /**
   * Groups a bunch of related tests.
   *
   * This level results in a `context` in the output format.
   *
   * @param name - Either the name or the function.
   * @param options - The name of the sprite that is linked to this group.
   * @param block - The function if a name is passed.
   */
  group(name: string, options: GroupOptions | string, block: () => void): void;

  /**
   * Groups a bunch of related tests.
   *
   * This level results in a `context` in the output format.
   *
   * @param name - Either the name or the function.
   * @param block - The function if a name is passed.
   */
  group(name: string, block: () => void): void;

  /**
   * Start a group for a certain sprite.
   *
   * @param options - At least the sprite should be given.
   * @param block - The block.
   */
  group(options: SpriteGroupOptions, block: () => void): void;

  group(
    name: string | SpriteGroupOptions,
    spriteOrBlock: string | GroupOptions | (() => void),
    block?: () => void,
  ): void {
    if (typeof spriteOrBlock === 'string') {
      spriteOrBlock = { sprite: spriteOrBlock };
    }
    if (typeof name !== 'string') {
      spriteOrBlock = name;
      name = `Testen voor ${name.sprite}`;
    }
    if (typeof spriteOrBlock !== 'object') {
      block = spriteOrBlock;
      spriteOrBlock = {};
    }

    this.resultManager.startGroup(name, spriteOrBlock.sprite);
    block!();
    this.resultManager.closeGroup(
      spriteOrBlock.summary,
      spriteOrBlock?.visibility as Visibility,
    );
  }
}
