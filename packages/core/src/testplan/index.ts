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
import { castCallback, MessageData, numericEquals, stringify } from '../utils';
import { Project } from '../project';
import { Evaluation } from '../evaluation';
import { Sb3Block, Sb3Target } from '../structures';

import type VirtualMachine from '@ftrprf/judge-scratch-vm-types';
import type BlockUtility from '@ftrprf/judge-scratch-vm-types/types/engine/block-utility';
import { LoggedSprite } from '../log';
import { cloneDeep } from 'lodash-es';
import { GroupedResultManager } from '../output';
import { t } from '../i18n';
import { Status } from '../output/schema';

export class FatalErrorException extends Error {}

/** @deprecated */
class GenericMatcher {
  private readonly resultManager: GroupedResultManager;
  private readonly actual: unknown;
  private readonly name: string;
  errorMessage?: (expected: unknown, actual: unknown) => string;
  successMessage?: (expected: unknown, actual: unknown) => string;
  terminate = false;
  expected: unknown;

  constructor(resultManager: GroupedResultManager, actual: unknown, name: string) {
    this.resultManager = resultManager;
    this.actual = actual;
    this.name = name;
  }

  /**
   * Post the result.
   *
   * @param accepted - If the property satisfies the condition.
   * @param [errorMessage] - Default error message.
   * @param [successMessage] - Optional success message.
   */
  private out(accepted: boolean, errorMessage?: string, successMessage?: string) {
    this.resultManager.startTest(this.name);
    this.resultManager.appendDiff(stringify(this.expected), stringify(this.actual));
    const status: Status = accepted ? 'correct' : 'wrong';

    let description;
    if (accepted) {
      const message = this.successMessage
        ? this.successMessage(this.expected, this.actual)
        : successMessage;
      if (message) {
        description = message;
      }
    } else {
      const message = this.errorMessage
        ? this.errorMessage(this.expected, this.actual)
        : errorMessage;
      if (message) {
        description = message;
      }
    }

    this.resultManager.closeTest(status, description);

    if (!accepted && this.terminate) {
      throw new FatalErrorException();
    }
  }

  /** @deprecated */
  withError(
    message: string | ((expected: unknown, actual: unknown) => string),
  ): GenericMatcher {
    this.errorMessage = castCallback(message);
    return this;
  }

  /** @deprecated */
  with(messages: MessageData): GenericMatcher {
    this.successMessage = castCallback(messages.correct);
    this.errorMessage = castCallback(messages.wrong);
    return this;
  }

  /** @deprecated */
  fatal(): GenericMatcher {
    this.terminate = true;
    return this;
  }

  /** @deprecated */
  toBe(expected: unknown): void {
    this.expected = expected;
    if (typeof this.actual === 'number' && typeof expected === 'number') {
      this.out(
        numericEquals(this.actual, expected),
        `Expected ${JSON.stringify(expected)} but got ${JSON.stringify(this.actual)}`,
      );
    } else {
      this.out(
        isEqual(this.actual, expected),
        `Expected ${JSON.stringify(expected)} but got ${JSON.stringify(this.actual)}`,
      );
    }
  }

  /** @deprecated */
  toNotBe(expected: unknown): void {
    this.expected = expected;
    if (typeof this.actual === 'number' && typeof expected === 'number') {
      this.out(
        !numericEquals(this.actual, expected),
        `Expected not ${JSON.stringify(expected)} but got ${JSON.stringify(this.actual)}`,
      );
    } else {
      this.out(
        !isEqual(this.actual, expected),
        `Expected ${JSON.stringify(expected)} but got ${JSON.stringify(this.actual)}`,
      );
    }
  }
}

/** @deprecated */
class ExpectLevel {
  constructor(
    private readonly resultManager: GroupedResultManager,
    private readonly name: string,
  ) {}

  /** @deprecated */
  expect(value: unknown): GenericMatcher {
    return new GenericMatcher(this.resultManager, value, this.name);
  }

  /** @deprecated */
  accept(): void {
    this.resultManager.startTest(this.name);
    this.resultManager.closeTest('correct');
  }
}

class TestLevel {
  constructor(protected readonly resultManager: GroupedResultManager) {}

  /** @deprecated */
  test(name: string, block: (out: ExpectLevel) => void) {
    block(new ExpectLevel(this.resultManager, name));
  }
}

class DescribeLevel extends TestLevel {
  /** @deprecated */
  describe(name: string, block: (out: TestLevel) => void) {
    this.resultManager.startGroup(name);
    block(this);
    this.resultManager.closeGroup();
  }
}

export class TabLevel extends DescribeLevel {
  /** @deprecated */
  tab(name: string, block: (out: DescribeLevel) => void): void {
    this.resultManager.startGroup(name);
    block(this);
    this.resultManager.closeGroup();
  }
}

function removeAttached(block: Sb3Block, from?: Sb3Target): Sb3Block[] {
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

// export function difference(object, base) {
//   function changes(object, base) {
//     return _.transform(object, function(result, value, key) {
//       if (!_.isEqual(value, base[key])) {
//         result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value;
//       }
//     });
//   }
//   return changes(object, base);
// }

/** @deprecated */
export class OneHatAllowedTest {
  private template: Project;
  private submission: Project;

  private ignoredSprites: string[] = ['Stage'];

  hatSprites: string[];
  /** @deprecated */
  hatSprite?: string;
  /** @deprecated */
  hatBlockFinder?: (value: Sb3Block, index: number, obj: Sb3Block[]) => boolean;
  /** @deprecated */
  allowedBlockCheck?: (value: Sb3Block, index: number, array: Sb3Block[]) => boolean;

  hatBlockFinders: Record<
    string,
    (value: Sb3Block, index: number, obj: Sb3Block[]) => boolean
  > = {};

  allowedBlockChecks: Record<
    string,
    (value: Sb3Block, index: number, array: Sb3Block[]) => boolean
  > = {};

  hatBlockSorter: (list: Sb3Block[]) => Sb3Block[] = (l) => l;

  /** @deprecated */
  constructor(template: Project, submission: Project) {
    this.template = template;
    this.submission = submission;
    this.hatSprites = [];
  }

  /** @deprecated */
  ignoredSprite(sprite: string): void {
    this.ignoredSprites.push(sprite);
  }

  /** @deprecated */
  execute(e: Evaluation): void {
    if (this.hatSprite) {
      this.hatSprites = [this.hatSprite];
    }
    if (this.hatBlockFinder) {
      this.hatBlockFinders = {};
      this.hatSprites.forEach((sprite) => {
        this.hatBlockFinders[sprite] = this.hatBlockFinder!;
      });
    }
    if (this.allowedBlockCheck) {
      this.allowedBlockChecks = {};
      this.hatSprites.forEach((sprite) => {
        this.allowedBlockChecks[sprite] = this.allowedBlockCheck!;
      });
    }
    e.describe(t('predefined.existing.name'), (l) => {
      this.template
        .sprites()
        .filter(
          (s) =>
            !this.ignoredSprites.includes(s.name) && !this.hatSprites.includes(s.name),
        )
        .map((s) => s.name)
        .forEach((sprite) => {
          l.test(sprite, (l) => {
            l.expect(this.template.hasChangedSprite(this.submission, sprite))
              .with({
                correct: t('predefined.existing.correct', sprite),
                wrong: t('predefined.existing.wrong', sprite),
              })
              .toBe(false);

            l.expect(this.template.hasChangedBlocks(this.submission, sprite))
              .with({
                correct: t('predefined.existing.correct_block', sprite),
                wrong: t('predefined.existing.wrong_block', sprite),
              })
              .toBe(false);
          });
        });

      l.test(t('predefined.stage'), (l) => {
        l.expect(this.template.hasChangedSprite(this.submission, 'Stage'))
          .with({
            correct: t('predefined.stage_correct'),
            wrong: t('predefined.stage_wrong'),
          })
          .toBe(false);

        l.expect(this.template.hasChangedBlocks(this.submission, 'Stage'))
          .with({
            correct: t('predefined.stage_correct_block'),
            wrong: t('predefined.stage_wrong_block'),
          })
          .toBe(false);
      });

      if (this.hatSprites.length === 0) {
        throw new Error('You must define a hat sprite before executing these tests.');
      }

      for (const hatSprite of this.hatSprites) {
        const solutionHatSprite = cloneDeep(this.submission.sprite(hatSprite));

        if (!solutionHatSprite) {
          l.test(hatSprite, (l) => {
            l.expect(true)
              .fatal()
              .with({
                wrong: t('predefined.deleted', hatSprite),
              })
              .toBe(false);
          });
        }

        const templateHatSprite = cloneDeep(this.template.sprite(hatSprite))!;
        // We test as follows: remove all blocks attached to the hat block.
        // The remaining blocks should be identical to the template sprite.
        // Start by finding the hat block (in the template, guaranteed to exist).
        const hatBlockFinder = this.hatBlockFinders[hatSprite];
        let solutionHatBlocks: Sb3Block[] =
          solutionHatSprite?.blocks?.filter(hatBlockFinder) || [];
        let templateHatBlocks: Sb3Block[] =
          templateHatSprite.blocks.filter(hatBlockFinder);

        if (
          solutionHatBlocks.length === 0 ||
          solutionHatBlocks.length < templateHatBlocks.length
        ) {
          l.test(hatSprite, (l) => {
            l.expect(true)
              .fatal()
              .with({
                wrong: t('predefined.necessary', hatSprite),
              })
              .toBe(false);
          });
        }

        // We remove all attached code from the hat block in the solution.
        solutionHatBlocks = this.hatBlockSorter(solutionHatBlocks);
        templateHatBlocks = this.hatBlockSorter(templateHatBlocks);

        const removedSolutionBlocks: Sb3Block[] = [];
        const removedTemplateBlocks: Sb3Block[] = [];

        for (
          let i = 0;
          i < Math.min(solutionHatBlocks.length, templateHatBlocks.length);
          i++
        ) {
          const solutionHatBlock = solutionHatBlocks[i];
          const templateHatBlock = templateHatBlocks[i];

          removedSolutionBlocks.push(
            ...removeAttached(solutionHatBlock, solutionHatSprite),
          );
          removedTemplateBlocks.push(
            ...removeAttached(templateHatBlock, templateHatSprite),
          );
        }

        const removedSolutionBlockIds = new Set(removedSolutionBlocks.map((b) => b.id));
        const removedTemplateBlockIds = new Set(removedTemplateBlocks.map((b) => b.id));

        const filteredSolutionBlocks = solutionHatSprite?.blocks?.filter(
          (b) => !removedSolutionBlockIds.has(b.id),
        );
        // Fix next block. Needed because the solution might contain a next block.
        if (filteredSolutionBlocks) {
          solutionHatBlocks.forEach((block) => {
            fixHatBlock(filteredSolutionBlocks, block);
          });
        }

        const filteredTemplateBlocks = templateHatSprite.blocks.filter(
          (b) => !removedTemplateBlockIds.has(b.id),
        );
        templateHatBlocks.forEach((block) => {
          fixHatBlock(filteredTemplateBlocks, block);
        });

        const solutionTree =
          solutionHatSprite?.blockTree(filteredSolutionBlocks || []) || new Set();
        const templateTree = templateHatSprite.blockTree(filteredTemplateBlocks);

        l.test(hatSprite, (l) => {
          l.expect(solutionTree.size <= templateTree.size)
            .with({
              wrong: t('predefined.around.wrong'),
              correct: t('predefined.around.correct'),
            })
            .toBe(true);
          if (solutionTree.size <= templateTree.size) {
            // if (!isEqual(templateTree, solutionTree)) {
            //   const d = difference(templateTree, solutionTree);
            //   const t_a = Array.from(templateTree).sort((a, b) => JSON.stringify(a) < JSON.stringify(b) ? -1 : 1);
            //   const s_a = Array.from(solutionTree).sort((a, b) => JSON.stringify(a) < JSON.stringify(b) ? -1 : 1);
            //   for (let i = 0; i < t_a.length; i++) {
            //     if (!isEqual(t_a[i], s_a[i])) {
            //       const dd = difference(t_a[i], s_a[i]);
            //       debugger;
            //     }
            //   }
            //   console.log(d);
            // }
            l.expect(isEqual(templateTree, solutionTree))
              .fatal()
              .with({
                wrong: t('predefined.preprogrammed.wrong', hatSprite),
                correct: t('predefined.preprogrammed.correct', hatSprite),
              })
              .toBe(true);
          }
        });

        const allowedBlockCheck = this.allowedBlockChecks[hatSprite];

        if (allowedBlockCheck) {
          // Verify that only allowed blocks are used.
          const usesAllowed = removedSolutionBlocks.every(allowedBlockCheck);
          // Don't show if no blocks.
          if (removedSolutionBlocks.length > 0) {
            l.test(t('predefined.allowed.name'), (l) => {
              l.expect(usesAllowed)
                .fatal()
                .with({
                  wrong: t('predefined.allowed.wrong'),
                  correct: t('predefined.allowed.correct'),
                })
                .toBe(true);
            });
          }
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
export function ignoreWaitInProcedureFor(vm: VirtualMachine, sprite: string): void {
  const original = vm.runtime._primitives.control_wait;
  vm.runtime._primitives.control_wait = (args: unknown, util: BlockUtility) => {
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

interface Range {
  min: number;
  max: number;
}

export function asRange(range: number | Range): Range {
  if (typeof range === 'number') {
    return { min: range, max: range };
  } else {
    return range;
  }
}

/** @deprecated * @deprecated
 */
export function generatePositionMessage(
  sprite: LoggedSprite,
  xRange: Range | number,
  yRange: Range | number,
): string {
  xRange = asRange(xRange);
  yRange = asRange(yRange);
  let message = `De sprite '${sprite.name}' moet `;

  let messageX = '';
  // First check x part.
  if (sprite.x < xRange.min) {
    messageX = 'meer naar links';
  } else if (sprite.x > xRange.max) {
    messageX = 'meer naar rechts';
  }

  let messageY = '';
  // First check x part.
  if (sprite.y < yRange.min) {
    messageY = 'meer omhoog';
  } else if (sprite.y > yRange.max) {
    messageY = 'meer omlaag';
  }

  message += messageX;
  if (messageX && messageY) {
    message += ' en ';
  }
  message += messageY;
  message += '.';
  return message;
}