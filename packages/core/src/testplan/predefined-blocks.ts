/**
 * @fileOverview
 *
 * Utilities to check if the students changed the predefined blocks and/or
 * sprites in their solution.
 */
import { isEqual, merge } from 'lodash-es';
import { Evaluation } from '../evaluation';
import { subTreeMatchesStack } from '../matcher/node-matcher';
import { BlockStack, Pattern } from '../matcher/patterns';
import { ScratchBlock } from '../model';
import { Node } from '../new-blocks';
import { Snapshot } from '../new-log';
import { assertType, deepDiff, stringify } from '../utils';
import { GroupLevel } from './hierarchy';

type BlockFunction = (block: Node) => boolean;

/**
 * The configuration for the pre-defined block config.
 */
export interface PredefinedBlockConfig {
  /**
   * Configuration for the different sprites.
   *
   * The predefined-block function checks by iterating each stack of blocks in
   * the template, and asserting that an identical block stack exists in the
   * solution.
   *
   * To allow students to write blocks, you can specify a function or stack of
   * block patterns for each sprite. The block stacks that match the pattern or
   * for which the function returns true are ignored.
   *
   * In this context, identical means functionally identical. For example,
   * block stacks that were moved are still considered identical.
   */
  spriteConfig: Record<string, BlockFunction | Pattern<BlockStack>>;

  /**
   * By default, blocks for which there is no equivalent in the template are
   * considered wrong. However, you can disable this per sprite (or globally).
   */
  allowAdditionalStacks?: boolean | Record<string, boolean>;

  /**
   * Allows you to override the sort function for the hat blocks. This is used
   * to match the blocks, so the order should be deterministic and unique for
   * blocks you want to consider the same.
   */
  blockComparator?: Parameters<Array<ScratchBlock>['sort']>[0];

  /**
   * A list of sprites that are ignored.
   */
  ignoredSprites?: string[];

  /**
   * If additional diagnostics should be printed or not.
   */
  debug?: boolean;
}

type InternalConfig = Required<
  Omit<PredefinedBlockConfig, 'spriteConfig' | 'allowAdditionalStacks'> & {
    spriteConfig: Record<string, BlockFunction>;
    allowAdditionalStacks: Record<string, boolean>;
  }
>;

const DEFAULT_CONFIG: Partial<PredefinedBlockConfig> = {
  spriteConfig: {},
  allowAdditionalStacks: false,
  ignoredSprites: [],
  blockComparator: (a, b) => stringify(a).localeCompare(stringify(b)),
  debug: false,
};

// Check a sprite, but without grouping.
function checkSpriteBlocks(
  name: string,
  template: Snapshot,
  submission: Snapshot,
  e: GroupLevel,
  config: InternalConfig,
): { correct: boolean; remainder: Node[] } {
  const templateSprite = template.findTarget(name)!;
  const submissionSprite = submission.findTarget(name);

  if (submissionSprite === undefined) {
    return { correct: false, remainder: [] };
  }

  const encountered: Set<Node> = new Set();
  const templateStacks = Array.from(templateSprite.blockTree());
  const submissionStacks = Array.from(submissionSprite.blockTree());

  let correct = true;

  // To check the blocks of the sprite itself, we must iterate each node in the template.
  for (const stack of templateStacks) {
    // If this stack matches a pattern or function, we allow modifications to it.
    let filter: (n: Node) => boolean;
    if (config.spriteConfig[name](stack)) {
      // When we ignore a stack, it must still exist in the submission. The main
      // difference is that we only match on the function/pattern, not the complete
      // stack.
      filter = (b) => config.spriteConfig[name](b);
    } else {
      // In this case, we want an identical stack in the submission.
      filter = (b) => isEqual(b, stack);
    }

    // Find the stack(s) in the submission and template.
    const submissionFiltered = submissionStacks.filter(filter);
    const templateFiltered = templateStacks.filter(filter);

    // The amount of matches in both should be equal.
    if (submissionFiltered.length === templateFiltered.length) {
      submissionFiltered.forEach((e) => encountered.add(e));
    } else {
      correct = false;
      if (config.debug) {
        const templateBlocks = template.target(name).blockTree();
        const submissionBlocks = submission.target(name).blockTree();
        const ddd = deepDiff(templateBlocks, submissionBlocks);
        console.log(ddd);
        // eslint-disable-next-line no-debugger
        debugger;
      }
    }
  }

  e.test()
    .feedback({
      wrong: `Oops, je hebt iets veranderd aan de blokjes sprite ${name}. Je gaat opnieuw moeten beginnen.`,
      correct: `Top! Je hebt niets veranderd aan de blokjes van sprite ${name}.`,
    })
    .acceptIf(correct);

  const remainingStacks = submissionStacks.filter((n) => !encountered.has(n));

  return { remainder: remainingStacks, correct };
}

function checkSpriteSensuStricto(
  name: string,
  template: Snapshot,
  submission: Snapshot,
  e: GroupLevel,
  config: InternalConfig,
) {
  const submissionSprite = submission.findTarget(name);

  e.test()
    .fatal()
    .feedback({
      wrong: `Oei, je verwijderde de sprite ${name}. Je zult opnieuw moeten beginnen.`,
      correct: `Top, de sprite ${name} is niet verwijderd.`,
    })
    .expect(submissionSprite)
    .toNotBe(undefined);

  const targetComparison = e
    .test()
    .feedback({
      correct: `Top! Je hebt niets veranderd aan de sprite ${name}.`,
      wrong: `Oops, je hebt iets veranderd aan de sprite ${name}. Je gaat opnieuw moeten beginnen.`,
    })
    .expect(template.hasChangedTarget(submission, name))
    .toBe(false);
  if (config.debug && !targetComparison) {
    const templateTarget = template.target(name);
    const submissionTarget = submission.target(name);
    const ddd = deepDiff(
      templateTarget.comparableObject(),
      submissionTarget.comparableObject(),
    );
    console.log(ddd);
    // eslint-disable-next-line no-debugger
    debugger;
  }
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
  const config = {} as Required<PredefinedBlockConfig>;
  merge(config, DEFAULT_CONFIG, userConfig);

  const template = evaluation.log.template;
  const submission = evaluation.log.submission;
  const e = evaluation.group;

  let defaultAllowAdditionalStacks;
  if (typeof config.allowAdditionalStacks === 'boolean') {
    defaultAllowAdditionalStacks = config.allowAdditionalStacks;
    config.allowAdditionalStacks = {};
  }

  // Fix config for hats.
  for (const target of template.targets) {
    const fromConfig = config.spriteConfig[target.name];
    if (fromConfig === undefined) {
      config.spriteConfig[target.name] = () => false;
    } else if (typeof fromConfig !== 'function') {
      config.spriteConfig[target.name] = (block: Node) => {
        return subTreeMatchesStack(block, fromConfig);
      };
    }
    config.allowAdditionalStacks[target.name] ??= defaultAllowAdditionalStacks ?? false;
  }

  assertType<InternalConfig>(config);

  e.group(
    'Controle op bestaande code',
    { visibility: 'summary', summary: 'De bestaande code is niet gewijzigd.' },
    () => {
      // We check each sprite.
      for (const target of template.targets) {
        const name = target.name;
        // If the sprite is ignored, stop now.
        if (config.ignoredSprites.includes(name)) {
          continue;
        }
        e.group(name, { sprite: name, visibility: 'summary' }, () => {
          // Check the sprite itself.
          checkSpriteSensuStricto(name, template, submission, e, config);

          // Check the blocks of the sprite.
          const { remainder, correct } = checkSpriteBlocks(
            name,
            template,
            submission,
            e,
            config,
          );

          // Check for floating blocks if needed and allowed.
          if (!config.allowAdditionalStacks[name] && correct) {
            const result = e
              .test('Test op rondslingerende blokjes')
              .feedback({
                wrong:
                  'Probeer je rondslingerende blokjes te verwijderen of te gebruiken.',
                correct: 'Goed zo! Je hebt geen losse blokjes laten rondslingeren.',
              })
              .expect(remainder.length)
              .toBe(0);
            if (!result && config.debug) {
              console.debug(remainder);
              debugger;
            }
          }
        });
      }
    },
  );
}
