/**
 * @fileOverview
 *
 * Utilities to check if the students changed the predefined blocks and/or
 * sprites in their solution.
 */
import { assertType, stringify, Writeable } from '../utils';
import { cloneDeep, isEmpty, isEqual } from 'lodash-es';
import { Evaluation } from '../evaluation';
import { ScratchBlock, ScratchTarget } from '../model';
import { PatternBlock } from '../matcher/patterns';
import { asNode, Node } from '../new-blocks';
import { matchesStackPattern } from '../matcher/node-matcher';

type BlockFilter = (value: ScratchBlock, index: number, array: ScratchBlock[]) => boolean;

/**
 * The configuration for the pre-defined block config.
 */
export interface PredefinedBlockConfig {
  /**
   * Sprites that are ignored completely.
   */
  ignoredSprites?: string[];

  /**
   * The hat blocks. The name of the sprite is mapped to
   * a filter method, that must return true if the hat block
   * in question is allowed to be modified.
   *
   * For example, a sprite might have some predefined blocks, and
   * one hat block with a broadcast "start". The filter function
   * should then only return true for the broadcast hat block.
   *
   * Another scenario is where the sprite has no blocks, and you
   * want to allow all blocks: in that case the filter function can
   * just always return true.
   */
  hats: Record<string, BlockFilter | PatternBlock[][]>;

  /**
   * You can optionally add (for each sprite or one for all) filter function
   * that returns true if the block in question is allowed. This will only be
   * called for hat blocks that can be modified.
   */
  allowedBlocks?: Record<string, BlockFilter> | BlockFilter;

  /**
   * Allows you to override the sort function for the hat blocks. This is used
   * to matched the blocks, so the order should be deterministic and unique for
   * blocks you want to consider the same.
   */
  blockComparator?: Parameters<Array<ScratchBlock>['sort']>[0];

  debug?: boolean;
}

const DEFAULT_CONFIG: Partial<PredefinedBlockConfig> = {
  ignoredSprites: ['Stage'],
  allowedBlocks: () => true,
  // TODO: a better default
  blockComparator: (a, b) => stringify(a).localeCompare(stringify(b)),
  debug: false,
};

/**
 * Remove all attached blocks from a sprite.
 *
 * @param block From which block to remove.
 * @param from The sprite to remove from.
 */
function removeAttached(block: ScratchBlock, from: ScratchTarget): ScratchBlock[] {
  // We remove all attached code from the hat block in the solution.
  const toCheck = new Set();
  toCheck.add(block.id);
  const toRemoveIds = new Set();
  const removedBlocks: ScratchBlock[] = [];
  while (toCheck.size !== 0) {
    const checking = toCheck.values().next().value;
    from.blocks
      .filter((b) => b.parent === checking)
      .forEach((b) => {
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

function fixHatBlock(filteredBlocks: ScratchBlock[], hatBlock: Writeable<ScratchBlock>) {
  const solutionIndex = filteredBlocks.findIndex((b) => b.id === hatBlock.id);
  hatBlock.next = undefined;
  filteredBlocks[solutionIndex] = hatBlock;
}

const Delta = {
  VALUE_CREATED: 'created',
  VALUE_UPDATED: 'updated',
  VALUE_DELETED: 'deleted',
  VALUE_UNCHANGED: 'unchanged',
};

function deepDiff(obj1: unknown, obj2: unknown) {
  function compareValues(value1: unknown, value2: unknown) {
    if (value1 === value2) {
      return Delta.VALUE_UNCHANGED;
    }
    if (value1 === undefined) {
      return Delta.VALUE_CREATED;
    }
    if (value2 === undefined) {
      return Delta.VALUE_DELETED;
    }
    return Delta.VALUE_UPDATED;
  }

  function isFunction(x: unknown) {
    return typeof x === 'function';
  }

  function isArray(x: unknown) {
    return Array.isArray(x);
  }
  function isObject(x: unknown) {
    return typeof x === 'object';
  }
  function isValue(x: unknown) {
    return !isObject(x) && !isArray(x);
  }

  if (isValue(obj1) || isValue(obj2)) {
    return {
      type: compareValues(obj1, obj2),
      data: obj1 === undefined ? obj2 : obj1,
    };
  }

  assertType<Record<string, unknown>>(obj1);
  assertType<Record<string, unknown>>(obj2);

  const diff: Record<string, unknown> = {};
  for (const key in obj1) {
    if (isFunction(obj1[key])) {
      continue;
    }

    let value2 = undefined;
    if (obj2[key] !== undefined) {
      value2 = obj2[key];
    }

    diff[key] = deepDiff(obj1[key], value2);
  }
  for (const key in obj2) {
    if (isFunction(obj2[key]) || diff[key] !== undefined) {
      continue;
    }

    diff[key] = deepDiff(undefined, obj2[key]);
  }

  return diff;
}

/**
 * Check the predefined blocks of a solution against a template. It can be used
 * to ensure students only changed code of allowed sprites. See the docs on the
 * config interfaces for more information.
 *
 * @param userConfig The config to use.
 * @param evaluation The evaluation, from which the data is extracted.
 */
export function checkPredefinedBlocks(
  userConfig: PredefinedBlockConfig,
  evaluation: Evaluation,
): void {
  const config = { ...DEFAULT_CONFIG, ...userConfig } as Required<PredefinedBlockConfig>;

  const template = evaluation.log.template;
  const submission = evaluation.log.submission;
  const e = evaluation.group;

  if (typeof config.allowedBlocks === 'function') {
    const object: Record<string, BlockFilter> = {};
    for (const hat in config.hats) {
      object[hat] = config.allowedBlocks;
    }
    config.allowedBlocks = object;
  }

  e.group(
    'Controle op bestaande code',
    { visibility: 'summary', summary: 'De bestaande code is nog steeds juist.' },
    () => {
      // We check each sprite.
      for (const target of template.targets) {
        const name = target.name;
        if (config.ignoredSprites.includes(name) || name in config.hats) {
          continue;
        }
        e.group(name, { sprite: name, visibility: 'summary' }, () => {
          e.test()
            .feedback({
              correct: `Top! Je hebt niets veranderd aan de sprite ${name}.`,
              wrong: `Oops, je hebt iets veranderd aan de sprite ${name}. Je gaat opnieuw moeten beginnen.`,
            })
            .expect(template.hasChangedTarget(submission, name))
            .toBe(false);
          e.test()
            .feedback({
              correct: `Top! Je hebt niets veranderd aan de blokjes van sprite ${name}.`,
              wrong: `Oops, je hebt iets veranderd aan de blokjes sprite ${name}. Je gaat opnieuw moeten beginnen.`,
            })
            .expect(template.hasChangedBlocks(submission, name))
            .toBe(false);
        });
      }

      // Do the same for the stage.
      e.group('Speelveld', { sprite: 'Speelveld', visibility: 'summary' }, () => {
        e.test('Gewijzigde sprite')
          .feedback({
            correct: 'Top! Je hebt niets veranderd aan het speelveld.',
            wrong:
              'Oops, je hebt iets veranderd aan het speelveld. Je gaat opnieuw moeten beginnen.',
          })
          .expect(template.hasChangedTarget(submission, 'Stage'))
          .toBe(false);
        e.test()
          .feedback({
            correct: `Top! Je hebt niets veranderd aan de blokjes van het speelveld.`,
            wrong: `Oops, je hebt iets veranderd aan de blokjes van het speelveld. Je gaat opnieuw moeten beginnen.`,
          })
          .expect(template.hasChangedBlocks(submission, 'Stage'))
          .toBe(false);
      });

      if (isEmpty(config.hats)) {
        throw new Error('You must define a hat sprite before executing these tests.');
      }

      for (const [hat, finder] of Object.entries(config.hats)) {
        e.group(hat, { sprite: hat, visibility: 'summary' }, () => {
          const solutionSprite = cloneDeep(submission.sprite(hat));
          e.test()
            .fatal()
            .feedback({
              wrong: `Oei, je verwijderde de sprite ${hat}. Je zal opnieuw moeten beginnen.`,
              correct: 'De sprite bestaat.',
            })
            .expect(solutionSprite)
            .toNotBe(undefined);

          const templateSprite = cloneDeep(template.sprite(hat))!;

          // We test as follows: remove all blocks attached to the hat block.
          // The remaining blocks should be identical to the template sprite.
          // Start by finding the hat block (in the template, guaranteed to exist).
          let solutionBlocks: ScratchBlock[];
          if (Array.isArray(finder)) {
            const blockMap = new Map(solutionSprite.blocks.map((i) => [i.id, i]));
            const nodes: Array<[string, Node]> = solutionSprite.blocks
              .filter((b) => b.topLevel)
              .map((b) => [b.id, asNode(b, blockMap)]);
            const matching = nodes.filter(([_id, node]) =>
              matchesStackPattern(node, ...finder),
            );
            solutionBlocks = matching.map(([id, _]) => blockMap.get(id)!);
          } else {
            solutionBlocks = solutionSprite.blocks.filter(finder);
          }

          let templateBlocks: ScratchBlock[];
          if (Array.isArray(finder)) {
            const blockMap = new Map(templateSprite.blocks.map((i) => [i.id, i]));
            const nodes: Array<[string, Node]> = templateSprite.blocks
              .filter((b) => b.topLevel)
              .map((b) => [b.id, asNode(b, blockMap)]);
            const matching = nodes.filter(([_id, node]) =>
              matchesStackPattern(node, ...finder),
            );
            templateBlocks = matching.map(([id, _]) => blockMap.get(id)!);
          } else {
            templateBlocks = templateSprite.blocks.filter(finder);
          }

          e.test()
            .fatal()
            .feedback({
              wrong: 'Oei, je verwijderde een voorgeprogrammeerde blokje.',
              correct: 'Goed zo, je hebt geen voorgeprogrammeerde blokjes verwijderd.',
            })
            .expect(
              // If there are no blocks in the template, it's fine as well.
              templateBlocks.length === 0 ||
                (solutionBlocks.length > 0 &&
                  solutionBlocks.length >= templateBlocks.length),
            )
            .toBe(true);

          // We remove all attached code from the hat block in the solution.
          solutionBlocks = solutionBlocks.sort(config.blockComparator);
          templateBlocks = templateBlocks.sort(config.blockComparator);

          const removedSolutionBlocks: ScratchBlock[] = [];
          const removedTemplateBlocks: ScratchBlock[] = [];
          const until = Math.min(solutionBlocks.length, templateBlocks.length);

          for (let i = 0; i < until; i++) {
            removedSolutionBlocks.push(
              ...removeAttached(solutionBlocks[i], solutionSprite),
            );
            removedTemplateBlocks.push(
              ...removeAttached(templateBlocks[i], templateSprite),
            );
          }

          const removedSolutionIds = new Set(removedSolutionBlocks.map((b) => b.id));
          const removedTemplateIds = new Set(removedTemplateBlocks.map((b) => b.id));

          const filteredSolutionBlocks = solutionSprite.blocks.filter(
            (b) => !removedSolutionIds.has(b.id),
          );
          // Fix next block. Needed because the solution might contain a next block.
          if (filteredSolutionBlocks) {
            for (const solutionBlock of solutionBlocks) {
              fixHatBlock(filteredSolutionBlocks, solutionBlock);
            }
          }

          const filteredTemplateBlocks = templateSprite.blocks.filter(
            (b) => !removedTemplateIds.has(b.id),
          );
          for (const templateBlock of templateBlocks) {
            fixHatBlock(filteredTemplateBlocks, templateBlock);
          }

          const solutionTree = solutionSprite.blockTree(filteredSolutionBlocks || []);
          const templateTree = templateSprite.blockTree(filteredTemplateBlocks);

          const result = e
            .test('Test op rondslingerende blokjes')
            .feedback({
              wrong: 'Probeer je rondslingerende blokjes te verwijderen of te gebruiken.',
              correct: 'Goed zo! Je hebt geen losse blokjes laten rondslingeren.',
            })
            .expect(solutionTree.size <= templateTree.size)
            .toBe(true);

          if (result) {
            const areEqual = isEqual(templateTree, solutionTree);

            if (config.debug && !areEqual) {
              const templateArray = Array.from(templateTree).sort((a, b) =>
                stringify(a).localeCompare(stringify(b)),
              );
              const solutionArray = Array.from(solutionTree).sort((a, b) =>
                stringify(a).localeCompare(stringify(b)),
              );
              for (let i = 0; i < templateArray.length; i++) {
                if (!isEqual(templateArray[i], solutionArray[i])) {
                  const ddd = deepDiff(templateArray[i], solutionArray[i]);
                  console.log(ddd);
                  // eslint-disable-next-line no-debugger
                  debugger;
                }
              }
            }

            e.test()
              .fatal()
              .feedback({
                wrong: `Je hebt aan de voorgeprogrammeerde blokjes van de sprite ${hat} wijzigingen aangebracht.`,
                correct: `Je hebt niets veranderd aan de voorgeprogrammeerde blokjes van de sprite ${hat}.`,
              })
              .expect(areEqual)
              .toBe(true);

            if (removedSolutionBlocks.length > 0) {
              assertType<Record<string, BlockFilter>>(config.allowedBlocks);
              const allowedBlockCheck = config.allowedBlocks[hat] as BlockFilter;
              // Verify that only allowed blocks are used.
              const usesAllowed = removedSolutionBlocks.every(allowedBlockCheck);
              e.test('Toegelaten blokjes')
                .feedback({
                  wrong:
                    'Oei, je gebruikt de verkeerde blokjes. Je mag enkel de blokjes uit mijn blokken en eindige lussen gebruiken.',
                  correct: 'Goed zo! Je gebruikt geen verkeerde blokjes.',
                })
                .expect(usesAllowed)
                .toBe(true);
            }
          }
        });
      }
    },
  );
}
