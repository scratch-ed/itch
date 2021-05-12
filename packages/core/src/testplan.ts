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
import isEqual from 'lodash-es/isEqual';
import { CORRECT, WRONG } from './output';
import { castCallback, MessageData, numericEquals } from './utils';
import { Context } from './context';
import { Project } from './project';
import { Evaluation } from './evaluation';
import { Sb3Block, Sb3Target } from './structures';

import type VirtualMachine from '@itch-types/scratch-vm';
import type BlockUtility from '@itch-types/scratch-vm/types/engine/block-utility';

export class FatalErrorException extends Error {}

class GenericMatcher {
  context: Context;
  actual: any;
  errorMessage?: (expected: any, actual: any) => string;
  successMessage?: (expected: any, actual: any) => string;
  terminate: boolean = false;
  expected: any;

  constructor(context: Context, actual: any) {
    this.context = context;
    this.actual = actual;
  }

  /**
   * Post the result.
   *
   * @param accepted - If the property satisfies the condition.
   * @param [errorMessage] - Default error message.
   * @param [successMessage] - Optional success message.
   */
  private out(accepted: boolean, errorMessage?: string, successMessage?: string) {
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
   * @deprecated
   */
  withError(message: string | ((expected: any, actual: any) => string)): GenericMatcher {
    this.errorMessage = castCallback(message);
    return this;
  }

  /**
   * Provide custom messages as output.
   */
  with(messages: MessageData): GenericMatcher {
    this.successMessage = castCallback(messages.correct);
    this.errorMessage = castCallback(messages.wrong);
    return this;
  }

  /**
   * Mark this test as fatal: if it fails, the testplan will stop.
   */
  fatal(): GenericMatcher {
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
   */
  toBe(expected: any): void {
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
   */
  toNotBe(expected: any): void {
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
  context: Context;

  constructor(context: Context) {
    this.context = context;
  }

  /**
   * Start an assertion be providing a value.
   */
  expect(value: any): GenericMatcher {
    return new GenericMatcher(this.context, value);
  }

  /**
   * Add a test that will always be accepted.
   */
  accept(): void {
    this.context.output.startTest(true);
    this.context.output.closeTest(true, true);
  }
}

class TestLevel {
  context: Context;

  constructor(context: Context) {
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
   */
  test(name: string, block: (out: ExpectLevel) => void) {
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
   * @param name - Either the name or the function.
   * @param block - The function if a name is passed.
   */
  describe(name: string, block: (out: TestLevel) => void) {
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
   */
  tab(name: string, block: (out: DescribeLevel) => void) {
    this.context.output.startTab(name);
    block(this);
    this.context.output.closeTab();
  }
}

function removeAttached(block: Sb3Block, from: Sb3Target | null): Sb3Block[] {
  // We remove all attached code from the hat block in the solution.
  const toCheck = new Set();
  toCheck.add(block.id);
  const toRemoveIds = new Set();
  const removedBlocks: Sb3Block[] = [];
  while (toCheck.size !== 0) {
    const checking = toCheck.values().next().value;
    from?.blocks
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

  return removedBlocks;
}

function fixHatBlock(filteredBlocks: Sb3Block[], hatBlock: Sb3Block) {
  const solutionIndex = filteredBlocks.findIndex((b) => b.id === hatBlock.id);
  hatBlock.next = null;
  filteredBlocks[solutionIndex] = hatBlock;
}

export class OneHatAllowedTest {
  private template: Project;
  private submission: Project;

  private ignoredSprites: string[] = ['Stage'];
  private hatSprite?: string;
  private hatBlockFinder?: any;
  private allowedBlockCheck ?: any;

  constructor(template: Project, submission: Project) {
    this.template = template;
    this.submission = submission;
  }

  ignoredSprite(sprite: string) {
    this.ignoredSprites.push(sprite);
  }

  execute(e: Evaluation) {
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

      if (typeof this.hatSprite === 'undefined') {
        throw new Error("You must define a hat sprite before executing these tests.");
      }

      const solutionHatSprite = this.submission.sprite(this.hatSprite);
      const templateHatSprite = this.template.sprite(this.hatSprite)!;
      // We test as follows: remove all blocks attached to the hat block.
      // The remaining blocks should be identical to the template sprite.
      // Start by finding the hat block (in the template, guaranteed to exist).
      const solutionHatBlock = solutionHatSprite?.blocks?.find(
        this.hatBlockFinder,
      );
      const templateHatBlock = templateHatSprite.blocks.find(
        this.hatBlockFinder,
      )!;

      if (typeof solutionHatBlock === 'undefined') {
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
      const removedSolutionBlocks = removeAttached(
        solutionHatBlock!,
        solutionHatSprite,
      );
      const removedSolutionBlockIds = new Set(
        removedSolutionBlocks.map((b) => b.id),
      );

      const removedTemplateBlocks = removeAttached(
        templateHatBlock,
        solutionHatSprite,
      );
      const removedTemplateBlockIds = new Set(
        removedTemplateBlocks.map((b) => b.id),
      );

      const filteredSolutionBlocks = solutionHatSprite?.blocks?.filter(
        (b) => !removedSolutionBlockIds.has(b.id),
      );
      // Fix next block. Needed because the solution might contain a next block.
      if (solutionHatBlock && filteredSolutionBlocks) {
        fixHatBlock(filteredSolutionBlocks, solutionHatBlock);
      }

      const filteredTemplateBlocks = templateHatSprite.blocks.filter(
        (b) => !removedTemplateBlockIds.has(b.id),
      );
      fixHatBlock(filteredTemplateBlocks, templateHatBlock);

      const solutionTree =
        solutionHatSprite?.blockTree(filteredSolutionBlocks || []) || new Set();
      const templateTree = templateHatSprite.blockTree(filteredTemplateBlocks);

      l.test(this.hatSprite, (l) => {
        l.expect(solutionTree.size <= templateTree.size)
          .with({
            wrong:
              'Probeer je rondslingerende blokjes te verwijderen of te gebruiken.',
            correct: 'Goed zo! Je hebt geen losse blokjes laten rondslingeren.',
          })
          .toBe(true);
        if (solutionTree.size <= templateTree.size) {
          l.expect(isEqual(templateTree, solutionTree))
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
        const usesAllowed = removedSolutionBlocks.every(this.allowedBlockCheck);
        // Don't show if no blocks.
        if (removedSolutionBlocks.length > 0) {
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
    });
  }
}

/**
 * EXPERIMENTAL!
 *
 * Intercepts wait blocks in procedure definitions in the given sprite for the
 * given amount and ignores them.
 *
 * @param {VirtualMachine} vm
 * @param {string} sprite
 */
export function ignoreWaitInProcedureFor(vm: VirtualMachine, sprite: string) {
  const original = vm.runtime._primitives.control_wait;
  vm.runtime._primitives.control_wait = (args: any, util: BlockUtility) => {
    // Big hack to ignore wait in movement steps.
    if (util.thread!.target.getName() === sprite) {
      const glowId = util.thread!.blockGlowInFrame;
      if (glowId) {
        let current = util.thread!.blockContainer.getBlock(glowId);
        while (current?.parent !== null) {
          current = util.thread!.blockContainer.getBlock(current.parent);
        }
        if (current?.opcode === 'procedures_definition') {
          console.log(`Skipping ... ${current?.opcode}`);
          return;
        }
      }
    }

    original(args, util);
  };
}