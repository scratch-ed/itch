/**
 * @file This file contains the testplan API, i.e. most of the stuff
 * you use when writing a test plan. This API is inspired by Jest, so
 * if you are familiar, it should be fairly easy to pick up.
 *
 * ## Structure
 *
 * Itch provides 4 levels of groupings for tests:
 *
 * 1. `tab`
 * 2. `describe`
 * 3. `test`
 * 4. `expect`
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
import isEqual from 'lodash/isEqual';
import { CORRECT, WRONG } from './output.js';
import { castCallback } from './utils.js';

export class FatalErrorException extends Error {}

class GenericMatcher {
  constructor(context, actual) {
    /** @type {Context} */
    this.context = context;
    this.actual = actual;
    /** @type {function(any, any):string} */
    this.errorMessage = null;
    /** @type {function(any, any):string} */
    this.successMessage = null;
    /** @type {boolean} */
    this.terminate = false;
  }

  /**
   * Post the result.
   *
   * @param {boolean} accepted - If the property satisfies the condition.
   * @param {string} [errorMessage] - Default error message.
   * @param {string} [successMessage] - Optional success message.
   *
   * @private
   */
  out(accepted, errorMessage = undefined, successMessage = undefined) {
    this.context.output.startTest(this.expected);
    const status = accepted ? CORRECT : WRONG;

    if (accepted) {
      const message = this.successMessage
        ? this.successMessage(this.expected, this.actual)
        : successMessage;
      if (message) {
        this.context.output.appendMessage(message);
      }
    } else {
      const message = this.errorMessage
        ? this.errorMessage(this.expected, this.actual)
        : errorMessage;
      if (message) {
        this.context.output.appendMessage(message);
      }
    }

    this.context.output.closeTest(this.actual, accepted, status);

    if (!accepted && this.terminate) {
      throw new FatalErrorException();
    }
  }

  /**
   * Allows setting an error message.
   *
   * @param {string|function(any,any):string} message
   *
   * @return {GenericMatcher}
   * @deprecated
   */
  withError(message) {
    this.errorMessage = castCallback(message);
    return this;
  }

  /**
   * Allows setting an error message.
   *
   * @param {string|function(any,any):string} message
   *
   * @return {GenericMatcher}
   * @deprecated
   */
  withSuccess(message) {
    this.successMessage = castCallback(message);
    return this;
  }

  /**
   * Combines withSuccess & withError
   *
   * @param {{[correct]:string|function():string, [wrong]:string|function():string}} messages
   *
   * @return {GenericMatcher}
   */
  with(messages) {
    this.successMessage = castCallback(messages.correct);
    this.errorMessage = castCallback(messages.wrong);
    return this;
  }

  /**
   * Mark this test as fatal: if it fails, the testplan will stop.
   *
   * @return {GenericMatcher}
   */
  fatal() {
    this.terminate = true;
    return this;
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
   *
   * @param expected
   */
  toBe(expected) {
    this.expected = expected;
    if (typeof this.actual === 'number' && typeof expected === 'number') {
      this.out(
        numericEquals(this.actual, expected),
        `Expected ${JSON.stringify(expected)} but got ${JSON.stringify(
          this.actual,
        )}`,
      );
    } else {
      this.out(
        isEqual(this.actual, expected),
        `Expected ${JSON.stringify(expected)} but got ${JSON.stringify(
          this.actual,
        )}`,
      );
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
   *
   * @param expected
   */
  toNotBe(expected) {
    this.expected = expected;
    if (typeof this.actual === 'number' && typeof expected === 'number') {
      this.out(
        !numericEquals(this.actual, expected),
        `Expected ${expected?.toString()} but got ${this.actual?.toString()}`,
      );
    } else {
      this.out(
        !isEqual(this.actual, expected),
        `Expected ${expected?.toString()} but got ${this.actual?.toString()}`,
      );
    }
  }
}

class ExpectLevel {
  /**
   * @param {Context} context
   * @package
   */
  constructor(context) {
    this.context = context;
  }

  /**
   * Start an assertion be providing a value.
   *
   * You can optionally provide a custom error message.
   *
   * @param {*} value
   *
   * @return {GenericMatcher}
   */
  expect(value) {
    return new GenericMatcher(this.context, value);
  }

  /**
   * Add a test that will always be accepted.
   */
  accept() {
    this.context.output.startTest(true);
    this.context.output.closeTest(true, true);
  }
}

class TestLevel {
  /**
   * @param {Context} context
   * @package
   */
  constructor(context) {
    this.context = context;
  }

  /**
   * Check some properties as part of the same test.
   *
   * ### Test vs expect
   *
   * A good guideline to decide whether testing multiple properties
   * should happen in the same file or not: if it needs a name, it should
   * be a separate test.
   *
   * For example, if you are testing that a sprite moves down when pressing a key,
   * you might have one test, with two properties: one for x and one for y.
   *
   * On the other hand, you might want to have multiple tests: one for the position,
   * one for the orientation, etc.
   *
   * This level results in a `testcase` in the output format.
   *
   * @param {string} name
   * @param {function(out:ExpectLevel)} block
   */
  test(name, block) {
    this.context.output.startTestcase(name);
    block(new ExpectLevel(this.context));
    this.context.output.closeTestcase();
  }
}

class DescribeLevel extends TestLevel {
  /**
   * Groups a bunch of related tests.
   *
   * This level results in a `context` in the output format.
   *
   * @param {string} name - Either the name or the function.
   * @param {function(TestLevel)} block - The function if a name is passed.
   */
  describe(name = undefined, block = undefined) {
    this.context.output.startContext(name);
    block(this);
    this.context.output.closeContext();
  }
}

export class TabLevel extends DescribeLevel {
  /**
   * Run the tests in the block inside the tab.
   *
   * This level results in a `tab` in the output format.
   *
   * @param {string} name
   * @param {function(DescribeLevel)} block
   */
  tab(name, block) {
    this.context.output.startTab(name);
    block(this);
    this.context.output.closeTab();
  }
}
