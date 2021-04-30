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
import isEqual from 'lodash-es/isEqual.js';
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
        `Expected not ${JSON.stringify(expected)} but got ${JSON.stringify(
          this.actual,
        )}`,
      );
    } else {
      this.out(
        !isEqual(this.actual, expected),
        `Expected ${JSON.stringify(expected)} but got ${JSON.stringify(
          this.actual,
        )}`,
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

export class OneHatAllowedTest {
  constructor(template, submission) {
    this.template = template;
    this.submission = submission;

    this.ignoredSprites = ['Stage'];
    this.hatSprite = undefined;
    this.hatBlockFinder = undefined;
    this.allowedBlockCheck = undefined;
  }

  ignoredSprite(sprite) {
    this.ignoredSprites.push(sprite);
  }

  /**
   * @param {Evaluation} e
   */
  execute(e) {
    e.describe('Controle op bestaande code', (l) => {
      this.template
        .sprites()
        .filter(
          (s) =>
            !this.ignoredSprites.includes(s.name) && this.hatSprite !== s.name,
        )
        .map((s) => s.name)
        .forEach((sprite) => {
          l.test(sprite, (l) => {
            l.expect(this.template.hasChangedSprite(this.submission, sprite))
              .with({
                correct: `Top! Je hebt niets veranderd aan de sprite ${sprite}.`,
                wrong: `Oops, je hebt iets veranderd aan de sprite ${sprite}. Je gaat opnieuw moeten beginnen.`,
              })
              .toBe(false);

            l.expect(this.template.hasChangedBlocks(this.submission, sprite))
              .with({
                correct: `Top! Je hebt niets veranderd aan de blokjes van sprite ${sprite}.`,
                wrong: `Oops, je hebt iets veranderd aan de blokjes sprite ${sprite}. Je gaat opnieuw moeten beginnen.`,
              })
              .toBe(false);
          });
        });

      l.test('Speelveld', (l) => {
        l.expect(this.template.hasChangedSprite(this.submission, 'Stage'))
          .with({
            correct: `Top! Je hebt niets veranderd aan het speelveld.`,
            wrong: `Oops, je hebt iets veranderd aan het speelveld. Je gaat opnieuw moeten beginnen.`,
          })
          .toBe(false);

        l.expect(this.template.hasChangedBlocks(this.submission, 'Stage'))
          .with({
            correct: `Top! Je hebt niets veranderd aan de blokjes van het speelveld.`,
            wrong: `Oops, je hebt iets veranderd aan de blokjes van het speelveld. Je gaat opnieuw moeten beginnen.`,
          })
          .toBe(false);
      });

      const solutionHatSprite = this.submission.sprite(this.hatSprite);
      const templateHatSprite = this.template.sprite(this.hatSprite);
      // We test as follows: remove all blocks attached to the hat block.
      // The remaining blocks should be identical to the template sprite.
      // Start by finding the hat block (in the template, guaranteed to exist).
      const hatBlock = solutionHatSprite?.blocks?.find(this.hatBlockFinder);

      if (!hatBlock) {
        l.test(this.hatSprite, (l) => {
          l.expect(true)
            .fatal()
            .with({
              wrong: `Oei, je verwijderde een noodzakelijk blokje bij de sprite ${this.hatSprite}`,
            })
            .toBe(false);
        });
      }

      // We remove all attached code from the hat block in the solution.
      const toCheck = new Set();
      toCheck.add(hatBlock.id);
      const toRemoveIds = new Set();
      const removedBlocks = [];
      while (toCheck.size !== 0) {
        const checking = toCheck.values().next().value;
        solutionHatSprite?.blocks
          ?.filter((b) => b.parent === checking)
          ?.forEach((b) => {
            if (!toRemoveIds.has(b.id)) {
              toRemoveIds.add(b.id);
              removedBlocks.push(b);
              toCheck.add(b.id);
            }
          });
        toCheck.delete(checking);
      }

      const filteredBlocks = solutionHatSprite?.blocks?.filter(
        (b) => !toRemoveIds.has(b.id),
      );
      // Fix next block. Needed because the solution might contain a next block.
      if (hatBlock && filteredBlocks) {
        const solutionIndex = filteredBlocks.findIndex(
          (b) => b.id === hatBlock.id,
        );
        hatBlock.next = null;
        filteredBlocks[solutionIndex] = hatBlock;
      }

      const solutionTree =
        solutionHatSprite?.blockTree(filteredBlocks || []) || new Set();
      const templateTree = templateHatSprite.blockTree();

      l.test(this.hatSprite, (l) => {
        if (solutionTree.size > templateTree.size) {
          l.expect(true)
            .with({
              wrong:
                'Probeer je rondslingerende blokjes te verwijderen of te gebruiken',
            })
            .toBe(false);
        } else {
          l.expect(_.isEqual(templateTree, solutionTree))
            .fatal()
            .with({
              wrong: `Je hebt aan de voorgeprogrammeerde blokjes van de sprite ${this.hatSprite} wijzigingen aangebracht.`,
              correct: `Je hebt niets veranderd aan de voorgeprogrammeerde blokjes van de sprite ${this.hatSprite}.`,
            })
            .toBe(true);
        }
      });

      if (this.allowedBlockCheck) {
        // Verify that only allowed blocks are used.
        const usesAllowed = removedBlocks.every(this.allowedBlockCheck);
        // Don't show if no blocks.
        if (removedBlocks.length > 0) {
          l.test('Juiste blokjes', (l) => {
            l.expect(usesAllowed)
              .fatal()
              .with({
                wrong:
                  'Oei, je gebruikt de verkeerde blokjes. Je mag enkel de blokjes uit mijn blokken en eindige lussen gebruiken.',
                correct: 'Goed zo! Je gebruikt geen verkeerde blokjes.',
              })
              .toBe(true);
          });
        }
      }
    };);
  }
}
