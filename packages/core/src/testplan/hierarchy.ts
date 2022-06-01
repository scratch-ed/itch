/**
 * @file
 *
 * This file contains the testplan API, i.e. most of the stuff
 * you use when writing a test plan. This API is inspired by Jest.
 *
 * There are two primitives:
 *
 * 1. Groups
 * 2. Tests
 *
 * Groups are used to organise the tests, while tests actually compare two values
 * to see if they are equal or not.
 */
import isEqual from 'lodash-es/isEqual';
import { nodeMatchesPattern, subTreeMatchesStack } from '../matcher/node-matcher';
import { BlockStack, Pattern, PatternBlock } from '../matcher/patterns';
import { castCallback, numericEquals, stringify } from '../utils';
import { GroupedResultManager } from '../output';
import { Visibility } from '../output/partial-schema';
import { isNode } from '../new-blocks';

export class FatalErrorException extends Error {
  public readonly type: string;
  constructor() {
    super();
    this.type = 'FatalErrorException';
  }
}

export class RuntimeException extends Error {}

interface OutputCallback {
  (accepted: boolean, expected?: unknown, actual?: unknown): boolean;
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
   *
   * @return The value of the test.
   */
  toBe(expected: unknown): boolean {
    return this.callback(this.accepted(expected), expected, this.actual);
  }

  /**
   * Match the value against a pattern.
   *
   * In this case, the value must be a Node, or it will throw, as this is
   * considered a programming error.
   *
   * @param blockPattern
   */
  toMatch(blockPattern: Pattern<PatternBlock>): boolean {
    // It can possibly be a node.
    if (!(isNode(this.actual) || this.actual === null || this.actual === undefined)) {
      throw new Error(`Found non-Node: ${this.actual}, expected Node.`);
    }

    const accepted = nodeMatchesPattern(this.actual, blockPattern);
    return this.callback(accepted);
  }

  /**
   * Match the value against a subtree.
   *
   * In this case, the value must be a Node, or it will throw, as this is
   * considered a programming error.
   */
  toMatchSubtree(stackPattern: Pattern<BlockStack>): boolean {
    // It can possibly be a node.
    if (!(isNode(this.actual) || this.actual === null || this.actual === undefined)) {
      throw new Error(`Found non-Node: ${this.actual}, expected Node.`);
    }

    const accepted = subTreeMatchesStack(this.actual, stackPattern);
    return this.callback(accepted);
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
   *
   * @return The value of the test.
   */
  toNotBe(expected: unknown): boolean {
    return this.callback(!this.accepted(expected), expected, this.actual);
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
  private testTags: string[] = [];
  private ignoreWrongResult = false;

  constructor(
    private readonly resultManager: GroupedResultManager,
    private readonly name?: string,
  ) {}

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

  ignoreWrong(ignoreIt: boolean) {
    this.ignoreWrongResult = ignoreIt;
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
   * Start a test with the actual value. This is terminal operation: you can
   * no longer change the test after this.
   *
   * @param actual
   *
   * @return The match, which allows to determine when the condition is true.
   */
  expect(actual: unknown): Matcher {
    // We pass a method, so set the "this" correctly.
    return new Matcher(this.out.bind(this), actual);
  }

  /**
   * Accept the test if the passed boolean is correct.
   *
   * @param correct
   */
  acceptIf(correct: boolean): boolean {
    return this.out(correct);
  }

  feedback(messages: Messages): TestOptions {
    this.correctMessage = castCallback(messages.correct);
    this.errorMessage = castCallback(messages.wrong);
    return this;
  }

  tags(...tags: string[]): TestOptions {
    this.testTags = tags;
    return this;
  }

  private out(accepted: boolean, expected?: unknown, actual?: unknown): boolean {
    // If the test is not accepted, and we ignore wrong results, stop now.
    if (this.ignoreWrongResult && !accepted) {
      return accepted;
    }

    // Start the test.
    this.resultManager.startTest(this.name, this.testTags);

    const status = accepted ? 'correct' : 'wrong';
    const messageCallback = accepted ? this.correctMessage : this.errorMessage;
    const summary = messageCallback?.(expected, actual);

    // Add diff if needed.
    if (this.enableDiff) {
      this.resultManager.appendDiff(stringify(expected), stringify(actual));
    }

    // Stop the test.
    this.resultManager.closeTest(status, summary);

    if (!accepted && this.terminate) {
      throw new FatalErrorException();
    }

    return accepted;
  }
}

export interface GroupOptions {
  sprite?: string;
  summary?: string;
  visibility?: Visibility;
  tags?: string[];
}

export interface SpriteGroupOptions extends GroupOptions {
  sprite: string;
}

export class GroupLevel {
  constructor(public readonly resultManager: GroupedResultManager) {}

  /**
   * Start a test.
   * @param name - Optional name of the test.
   */
  test(name?: string): TestOptions {
    return new TestOptions(this.resultManager, name);
  }

  /**
   * Groups a bunch of related tests.
   *
   * This level results in a `context` in the output format.
   *
   * @param name - Either the name or the function.
   * @param options - The options for this function.
   * @param block - The function if a name is passed.
   */
  group(name: string, options: GroupOptions, block: () => void): void;

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
    nameOrOptions: string | SpriteGroupOptions,
    optionsOrBlock: GroupOptions | (() => void),
    maybeBlock?: () => void,
  ): void {
    let name: string;
    let block: () => void;
    let options: GroupOptions | undefined = undefined;

    if (
      typeof nameOrOptions === 'string' &&
      typeof optionsOrBlock === 'object' &&
      typeof maybeBlock === 'function'
    ) {
      // First case; three parameters.
      name = nameOrOptions;
      block = maybeBlock;
      options = optionsOrBlock;
    } else if (
      typeof nameOrOptions === 'object' &&
      typeof optionsOrBlock === 'function'
    ) {
      // Third case; sprite & block.
      name = `Testen voor ${nameOrOptions.sprite}`;
      block = optionsOrBlock;
    } else if (
      typeof nameOrOptions === 'string' &&
      typeof optionsOrBlock === 'function'
    ) {
      // Second case; name & block.
      name = nameOrOptions;
      block = optionsOrBlock;
    } else {
      throw new Error('Wrong arguments to group function.');
    }

    const tags = options?.tags ?? [];
    this.resultManager.startGroup(
      name,
      options?.visibility ?? 'show',
      tags,
      options?.sprite,
    );
    block!();
    this.resultManager.closeGroup(options?.summary);
  }
}
