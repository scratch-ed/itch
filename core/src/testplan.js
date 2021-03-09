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

export const CORRECT = { enum: 'correct', human: 'Correct' };
export const WRONG = { enum: 'wrong', human: 'Wrong' };

class GenericMatcher {
  constructor(context, actual, message = undefined) {
    this.context = context;
    this.actual = actual;
    this.message = message;
  }

  /**
   * Post the result.
   * 
   * @param {boolean} accepted - If the property satisfies the condition.
   * @param {string} message - Default error message.
   * 
   * @private
   */
  out(accepted, message) {
    this.context.output.startTest(this.expected);
    let status;
    if (accepted) {
      status = CORRECT;
    } else {
      status = WRONG;
    }
    this.context.output.closeTest(this.actual, status);
    if (!accepted) {
      if (this.message) {
        let finalMessage;
        if (typeof this.message === 'function') {
          finalMessage = this.message(this.actual, this.expected);
        } else {
          finalMessage = this.message;
        }
        this.context.output.addMessage(finalMessage);
      } else {
        this.context.output.addMessage(message);
      }
    }
  }

  /**
   * Allows setting an error message in a fluent way.
   * 
   * @param {string|function(actual:any,expected:any):string} message
   * 
   * @return {GenericMatcher}
   */
  withError(message) {
    this.message = message;
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
      this.out(numericEquals(this.actual, expected),
        `Expected ${expected.toString()} but got ${this.actual.toString()}`);
    } else {
      this.out(isEqual(this.actual, expected),
        `Expected ${expected.toString()} but got ${this.actual.toString()}`);
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
      this.out(!numericEquals(this.actual, expected),
        `Expected ${expected.toString()} but got ${this.actual.toString()}`);
    } else {
      this.out(!isEqual(this.actual, expected),
        `Expected ${expected.toString()} but got ${this.actual.toString()}`);
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
   * @param {string} [errorMessage]
   *
   * @return {GenericMatcher}
   */
  expect(value, errorMessage = undefined) {
    return new GenericMatcher(this.context, value, errorMessage);
  }

  /**
   * Add a test that will always be accepted.
   */
  accept() {
    this.context.output.startTest(true);
    this.context.output.closeTest(true, CORRECT);
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
    this.context.output.startTestCase(name);
    block(new ExpectLevel(this.context));
    this.context.output.closeTestCase();
  }
}

class DescribeLevel extends TestLevel {
  /**
   * Groups a bunch of related tests.
   *
   * This level results in a `context` in the output format.
   *
   * @param {string|function} name - Either the name or the function.
   * @param {function(TestLevel)} block - The function if a name is passed.
   */
  describe(name, block = undefined) {
    if (typeof name === 'string') {
      this.context.output.startTestContext(name);
    } else {
      this.context.output.startTestContext();
    }
    block(this);
    this.context.output.closeTestContext();
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
    this.context.output.startTestTab(name);
    block(this);
    this.context.output.closeTestTab();
  }
}
