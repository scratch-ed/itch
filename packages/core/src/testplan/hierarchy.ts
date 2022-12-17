/**
 * This module provides convenience classes to create groups and tests.
 *
 * See the _Introduction to testing_ document for the conceptual overview.
 * The JavaScript docs are mainly on the {@link GroupLevel} and {@link TestOptions}
 * classes.
 *
 * @module
 */
import isEqual from 'lodash-es/isEqual';
import { nodeMatchesPattern, subTreeMatchesScript } from '../matcher/node-matcher';
import { BlockScript, Pattern, PatternBlock } from '../matcher/patterns';
import { castCallback, numericEquals, stringify } from '../utils';
import { ResultManager } from '../output';
import { Visibility } from '../output/partial-schema';
import { isNode } from '../blocks';

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

/**
 * Provides methods to check if some condition is true.
 * This API is inspired by Jest.
 */
export class Matcher {
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
  toMatchSubtree(stackPattern: Pattern<BlockScript>): boolean {
    // It can possibly be a node.
    if (!(isNode(this.actual) || this.actual === null || this.actual === undefined)) {
      throw new Error(`Found non-Node: ${this.actual}, expected Node.`);
    }

    const accepted = subTreeMatchesScript(this.actual, stackPattern);
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

export interface CorrectMessage {
  correct: string | MessageCallback;
  wrong?: string | MessageCallback;
}

export interface WrongMessage {
  correct?: string | (() => string);
  wrong: string | (() => string);
}

export type Messages = CorrectMessage | WrongMessage;

/**
 * Class to create a test.
 *
 * In general, you first want to configure your test with all the data you want
 * (e.g. providing {@link feedback}, adding a {@link diff}, etc.), before finally
 * doing the actual test.
 *
 * For doing the actual test, there are two categories:
 *
 * - Simple checks like {@link acceptIf}.
 * - Matchers (with {@link expect}), see {@link Matcher}.
 */
export class TestOptions {
  private errorMessage?: MessageCallback;
  private correctMessage?: MessageCallback;
  private terminate = false;
  private enableDiff = false;
  private testTags: string[] = [];
  private ignoreWrongResult = false;

  constructor(
    private readonly resultManager: ResultManager,
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

  /**
   * Ignore wrong results.
   *
   * If you pass true to this method, a failing test will not result in any
   * output being produced; instead it will be silently ignored.
   *
   * @param ignoreIt Ignore failing tests or not.
   */
  ignoreWrong(ignoreIt: boolean) {
    this.ignoreWrongResult = ignoreIt;
    return this;
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

/**
 * The options for a group in the feedback of the judge.
 */
export interface GroupOptions {
  /**
   * Optionally link the group to a given sprite.
   *
   * While this is not used at the moment, in the future we might link to or
   * display the sprite.
   */
  sprite?: string;
  /**
   * A summary of the group, to be shown if everything is correct.
   */
  summary?: string;
  /**
   * The visibility of the group. See the general docs for more information.
   */
  visibility?: Visibility;
  /**
   * Optional tags for this group, useful for analytics.
   */
  tags?: string[];
  /**
   * If tests in the group (and the group as a whole) should ignore wrong tests.
   *
   * This means that wrong tests will not be outputted; they are thus completely
   * ignored.
   */
  ignoreWrong?: boolean;
}

/**
 * See {@link GroupOptions}.
 * The only difference is that the sprite must be given here, instead of being
 * optional.
 */
export interface SpriteGroupOptions extends GroupOptions {
  sprite: string;
}

/**
 * Convenience class to create groups and tests.
 *
 * The start methods are {@link group} and {@link test}.
 *
 * As described in the general documentation, the feedback of the judge is
 * represented by tests.
 *
 * Additional structure is provided by the groups, which can also be nested.
 *
 * The _Introduction to testing_ for more high-level information, or consult
 * the docs of the {@link group} and {@link test} methods for more detailed information.
 */
export class GroupLevel {
  /**
   * Access the raw result manager.
   * In most cases, it is recommended to use the {@link group} and {@link test} instead.
   */
  public readonly resultManager: ResultManager;

  /** @internal */
  constructor(resultManager: ResultManager) {
    this.resultManager = resultManager;
  }

  /**
   * Start a test.
   *
   * See the return type for information about what is available for tests.
   *
   * @param name - Optional name of the test.
   */
  test(name?: string): TestOptions {
    return new TestOptions(this.resultManager, name);
  }

  /**
   * Groups a bunch of related tests or subgroups.
   *
   * This is the full function signature, with a name, the options and a group
   * block.
   * Other signatures might be more convenient.
   *
   * @param name - The name for this group.
   * @param options - The options for this group.
   * @param block - The group function. All groups and tests inside this function
   * will be part of this group.
   * @return true or false if the option ignoreWrong is set
   */
  group(name: string, options: GroupOptions, block: () => void): boolean | void;

  /**
   * Groups a bunch of related tests or subgroups.
   *
   * This signature supports no options.
   *
   * @param name - The name for this group.
   * @param block - The group function. All groups and tests inside this function
   * will be part of this group.
   * @return true or false if the option ignoreWrong is set
   */
  group(name: string, block: () => void): boolean | void;

  /**
   * Start a group for a certain sprite.
   *
   * In this signature, certain data is extracted from the sprite, such as the
   * name of the group.
   * The sprite is also passed to the output as special metadata, meaning the
   * frontend might one day show a small image of the sprite.
   *
   * @param options - The options for this group, with at least the sprite
   * @param block - The group function. All groups and tests inside this function
   * will be part of this group.
   * @return true or false if the option ignoreWrong is set
   */
  group(options: SpriteGroupOptions, block: () => void): boolean | void;

  group(
    nameOrOptions: string | SpriteGroupOptions,
    optionsOrBlock: GroupOptions | (() => void),
    maybeBlock?: () => void,
  ): boolean | void {
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
      options = nameOrOptions;
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
    // Stop and hold the output temporarily.
    if (options?.ignoreWrong) {
      this.resultManager.pauzeOutput();
    }
    this.resultManager.startGroup(
      name,
      options?.visibility ?? 'show',
      tags,
      options?.sprite,
    );
    block!();
    this.resultManager.closeGroup(options?.summary);

    if (options?.ignoreWrong) {
      // If we want to ignore wrong output, check the saved output buffer for
      // wrong tests. If there are any, discard the output, otherwise, print it.
      const shouldDiscard = this.resultManager.hasWrongTestInBuffer();
      this.resultManager.unpauzeOutput(shouldDiscard);
      return !shouldDiscard;
    }
  }
}
