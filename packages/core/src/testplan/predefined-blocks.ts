/**
 * @fileOverview
 *
 * Utilities to check if the students changed the predefined blocks and/or
 * sprites in their solution.
 */

import { Sb3Block, Sb3Target } from '../structures';
import { assertType, stringify } from '../utils';
import { Project } from '../project';
import { GroupLevel } from './hierarchy';
import { cloneDeep, isEmpty, isObject, transform } from 'lodash-es';
import isEqual from 'lodash-es/isEqual';

type BlockFilter = (value: Sb3Block, index: number, array: Sb3Block[]) => boolean;

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
   * a filter method, that will must return true if the hat
   * in question is allowed to be modified.
   */
  hats: Record<string, BlockFilter>;

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
  blockComparator?: Parameters<Array<Sb3Block>['sort']>[0];

  debug?: boolean;
}

const DEFAULT_CONFIG: Partial<PredefinedBlockConfig> = {
  ignoredSprites: [],
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
function removeAttached(block: Sb3Block, from: Sb3Target): Sb3Block[] {
  // We remove all attached code from the hat block in the solution.
  const toCheck = new Set();
  toCheck.add(block.id);
  const toRemoveIds = new Set();
  const removedBlocks: Sb3Block[] = [];
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

function fixHatBlock(filteredBlocks: Sb3Block[], hatBlock: Sb3Block) {
  const solutionIndex = filteredBlocks.findIndex((b) => b.id === hatBlock.id);
  hatBlock.next = null;
  filteredBlocks[solutionIndex] = hatBlock;
}

type Dict = Record<string, unknown>;

export function difference(object: Dict, base: Dict): Dict {
  function changes(object: Dict, base: Dict): Dict {
    return transform(object, (result, value, key: string) => {
      if (!isEqual(value, base[key])) {
        if (isObject(value) && isObject(base[key])) {
          result[key] = changes(value as Dict, base[key] as Dict);
        } else {
          result[key] = value;
        }
      }
    });
  }

  return changes(object, base);
}

/**
 * Check the predefined blocks of a solution against a template.
 * @param userConfig The config to use.
 * @param template
 * @param submission
 * @param e
 */
export function checkPredefinedBlocks(
  userConfig: PredefinedBlockConfig,
  template: Project,
  submission: Project,
  e: GroupLevel,
): void {
  const config = { ...DEFAULT_CONFIG, ...userConfig } as Required<PredefinedBlockConfig>;

  if (typeof config.allowedBlocks === 'function') {
    const object: Record<string, BlockFilter> = {};
    for (const hat in config.hats) {
      object[hat] = config.allowedBlocks;
    }
    config.allowedBlocks = object;
  }

  e.group('Controle op bestaande code', { visibility: 'collapse' }, () => {
    // We check each sprite.
    for (const sprite of template.sprites()) {
      const name = sprite.name;
      if (config.ignoredSprites.includes(name) || name in config.hats) {
        continue;
      }
      e.group(name, { sprite: name, visibility: 'collapse' }, () => {
        e.test()
          .feedback({
            correct: `Top! Je hebt niets veranderd aan de sprite ${name}.`,
            wrong: `Oops, je hebt iets veranderd aan de sprite ${name}. Je gaat opnieuw moeten beginnen.`,
          })
          .expect(template.hasChangedSprite(submission, name))
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
    e.group('Speelveld', { sprite: 'Speelveld', visibility: 'collapse' }, () => {
      e.test('Gewijzigde sprite')
        .feedback({
          correct: 'Top! Je hebt niets veranderd aan het speelveld.',
          wrong:
            'Oops, je hebt iets veranderd aan het speelveld. Je gaat opnieuw moeten beginnen.',
        })
        .expect(template.hasChangedSprite(submission, 'Stage'))
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
      e.group(hat, { sprite: hat, visibility: 'collapse' }, () => {
        const solutionSprite = cloneDeep(submission.sprite(hat));
        e.test()
          .fatal()
          .feedback({
            wrong: `Oei, je verwijderde de sprite ${hat}. Je zal opnieuw moeten beginnen.`,
            correct: 'De sprite bestaat.',
          })
          .expect(solutionSprite)
          .toNotBe(undefined);

        // The solution hat can no longer be undefined.
        assertType<Sb3Target>(solutionSprite);

        const templateSprite = cloneDeep(template.sprite(hat))!;

        // We test as follows: remove all blocks attached to the hat block.
        // The remaining blocks should be identical to the template sprite.
        // Start by finding the hat block (in the template, guaranteed to exist).
        let solutionBlocks = solutionSprite.blocks.filter(finder) ?? [];
        let templateBlocks = templateSprite.blocks.filter(finder);

        e.test()
          .fatal()
          .feedback({
            wrong: 'Oei, je verwijderde een voorgeprogrammeerde blokje.',
            correct: 'Goed zo, je hebt geen voorgeprogrammeerde blokjes verwijderd.',
          })
          .expect(
            solutionBlocks.length > 0 && solutionBlocks.length >= templateBlocks.length,
          )
          .toBe(true);

        // We remove all attached code from the hat block in the solution.
        solutionBlocks = solutionBlocks.sort(config.blockComparator);
        templateBlocks = templateBlocks.sort(config.blockComparator);

        const removedSolutionBlocks: Sb3Block[] = [];
        const removedTemplateBlocks: Sb3Block[] = [];
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
          const areEqual = e
            .test()
            .fatal()
            .feedback({
              wrong: `Je hebt aan de voorgeprogrammeerde blokjes van de sprite ${hat} wijzigingen aangebracht.`,
              correct: `Je hebt niets veranderd aan de voorgeprogrammeerde blokjes van de sprite ${hat}.`,
            })
            .expect(isEqual(templateTree, solutionTree))
            .toBe(true);

          if (config.debug && !areEqual) {
            const templateArray = Array.from(templateTree).sort((a, b) =>
              stringify(a).localeCompare(stringify(b)),
            );
            const solutionArray = Array.from(solutionTree).sort((a, b) =>
              stringify(a).localeCompare(stringify(b)),
            );
            for (let i = 0; i < templateArray.length; i++) {
              if (!isEqual(templateArray[i], solutionArray[i])) {
                const dd = difference(
                  templateArray[i] as unknown as Dict,
                  solutionArray[i] as unknown as Dict,
                );
                console.log(dd);
                // eslint-disable-next-line no-debugger
                debugger;
              }
            }
          }

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
  });
}
