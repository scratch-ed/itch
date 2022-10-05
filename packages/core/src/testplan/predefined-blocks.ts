/**
 * @fileOverview
 *
 * Utilities to check if the students changed the predefined blocks and/or
 * sprites in their solution.
 */
import { isEqual } from 'lodash-es';
import { Evaluation } from '../evaluation';
import { t } from '../i18n';
import { subTreeMatchesScript } from '../matcher/node-matcher';
import { BlockScript, Pattern, PatternBlock } from '../matcher/patterns';
import { ScratchBlock } from '../model';
import { Node, walkNodes } from '../blocks';
import { Snapshot } from '../log';
import { assertType, deepDiff, stringify } from '../utils';
import { GroupLevel } from './hierarchy';

type BlockFunction = (block: Node) => boolean;

/**
 * The options for the sprite config.
 */
interface Config {
  /**
   * The pattern to use to search for scripts that can be modified.
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
  pattern: BlockFunction | Pattern<BlockScript>;
  /**
   * A set of blocks that can be used. Unset to allow all blocks.
   */
  allowedBlocks?: Array<PatternBlock>;
  /**
   * Allow additional scripts in this sprite, that are not available in the
   * template project.
   */
  allowAdditionalScripts?: boolean;
}

/**
 * Configures the pre-defined block check.
 */
export interface PredefinedBlockConfig {
  /**
   * Configuration for the different sprites.
   *
   * See the config interface for an explanation of the various possibilities.
   * You can also pass the pattern directly, which is shorter in most cases.
   *
   * Note that if you want to allow unconditional editing of blocks for a sprite,
   * you should either add the sprite to the `ignoredSprites`, do the following:
   *
   * - Use `() => true` as the pattern, meaning you can modify any script.
   * - Set `allowAdditionalScripts` to `true`, for either this sprite or globally.
   */
  spriteConfig: Record<string, BlockFunction | Pattern<BlockScript> | Config>;

  /**
   * Allow additional scripts for all sprites.
   */
  allowAdditionalScripts?: boolean;

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

interface InternalSpriteConfig {
  pattern: BlockFunction;
  allowedBlocks: Array<PatternBlock> | undefined;
  allowAdditionalScripts: boolean;
}

interface InternalConfig {
  spriteConfig: Record<string, InternalSpriteConfig>;
  debug: boolean;
  ignoredSprites: string[];
  blockComparator: Parameters<Array<ScratchBlock>['sort']>[0];
}

/**
 * Convert an external config to the internal config.
 * This makes using it easier.
 */
function normalizeConfig(
  config: PredefinedBlockConfig,
  template: Snapshot,
): InternalConfig {
  for (const [spriteName, patternOrConfig] of Object.entries(config.spriteConfig)) {
    // If we get a pattern, in which case we convert to a config.
    let finalConfig: Config;
    if (
      typeof patternOrConfig === 'object' &&
      patternOrConfig.hasOwnProperty('pattern')
    ) {
      assertType<Config>(patternOrConfig);
      finalConfig = patternOrConfig;
    } else {
      assertType<BlockFunction | Pattern<BlockScript>>(patternOrConfig);
      finalConfig = {
        pattern: patternOrConfig,
      };
    }

    finalConfig.allowedBlocks = finalConfig.allowedBlocks ?? undefined;
    finalConfig.allowAdditionalScripts =
      finalConfig.allowAdditionalScripts ?? config.allowAdditionalScripts ?? false;

    config.spriteConfig[spriteName] = finalConfig;
  }

  const spriteConfig: Record<string, InternalSpriteConfig> = {};

  // Convert all patterns in the configs to BlockFunctions.
  // Fix config for hats.
  for (const target of template.targets) {
    const fromConfig = config.spriteConfig[target.name] as Config;
    if (fromConfig === undefined) {
      spriteConfig[target.name] = {
        pattern: () => false,
        allowedBlocks: undefined,
        allowAdditionalScripts: false,
      };
    } else if (typeof fromConfig.pattern !== 'function') {
      const existing = fromConfig.pattern;
      fromConfig.pattern = (block: Node) => {
        return subTreeMatchesScript(block, existing);
      };
      spriteConfig[target.name] = fromConfig as InternalSpriteConfig;
    } else {
      spriteConfig[target.name] = fromConfig as InternalSpriteConfig;
    }
  }

  return {
    spriteConfig: spriteConfig,
    debug: config.debug ?? false,
    ignoredSprites: config.ignoredSprites ?? [],
    blockComparator:
      config.blockComparator ?? ((a, b) => stringify(a).localeCompare(stringify(b))),
  };
}

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
  const spriteConfig = config.spriteConfig[name];

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
    if (spriteConfig.pattern(stack)) {
      // When we ignore a stack, it must still exist in the submission. The main
      // difference is that we only match on the function/pattern, not the complete
      // stack.
      filter = (b) => spriteConfig.pattern(b);
    } else {
      // In this case, we want an identical stack in the submission.
      filter = (b) => isEqual(b, stack);
    }

    // Find the stack(s) in the submission and template.
    const submissionFiltered = submissionStacks.filter(filter);
    const templateFiltered = templateStacks.filter(filter);

    // The number of matches in both should be equal.
    if (submissionFiltered.length >= templateFiltered.length) {
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

  e.test(t('predefined.existing.name'))
    .feedback({
      wrong: t('predefined.existing.wrong_block', name),
      correct: t('predefined.existing.correct_block', name),
    })
    .acceptIf(correct);

  // Do the check for remaining blocks, if needed.
  for (const [name, spriteConfig] of Object.entries(config.spriteConfig)) {
    if (spriteConfig.allowedBlocks === undefined) {
      continue;
    }
    // Allowed opcodes.
    const allowedOpcodes = new Set(spriteConfig.allowedBlocks.map((b) => b.opcode));
    // We add the opcodes of blocks in the template.
    const templateScripts = template
      .sprite(name)
      .blockTreeList()
      .filter((b) => spriteConfig.pattern(b));
    for (const templateScript of templateScripts) {
      walkNodes(templateScript, (n) => allowedOpcodes.add(n.opcode));
    }
    // Every block in the submission must be available in the allowed blocks.
    const submissionScripts = submission
      .sprite(name)
      .blockTreeList()
      .filter((b) => spriteConfig.pattern(b));
    const submissionOpcodes: Set<string> = new Set();
    for (const submissionScript of submissionScripts) {
      walkNodes(submissionScript, (n) => submissionOpcodes.add(n.opcode));
    }

    // Find blocks used that were not allowed.
    const illegallyUsed = new Set();
    for (const ss of submissionOpcodes) {
      if (!allowedOpcodes.has(ss)) {
        illegallyUsed.add(ss);
      }
    }

    e.test(t(':predefined.allowed.name'))
      .feedback({
        wrong: t('predefined.allowed.wrong'),
        correct: t('predefined.allowed.correct'),
      })
      .acceptIf(illegallyUsed.size === 0);

    if (config.debug && illegallyUsed.size !== 0) {
      console.warn('Found disallowed blocks:', illegallyUsed);
    }
  }

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

  e.test(t('predefined.deleted.name'))
    .fatal()
    .feedback({
      wrong: t('predefined.deleted.wrong', name),
      correct: t('predefined.deleted.correct', name),
    })
    .expect(submissionSprite)
    .toNotBe(undefined);

  const targetComparison = e
    .test(t('predefined.preprogrammed.name'))
    .feedback({
      wrong: t('predefined.preprogrammed.wrong', name),
      correct: t('predefined.preprogrammed.correct', name),
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
 * Check the predefined blocks of a solution against a template.
 *
 * It is common to add a check for pre-defined blocks in the `beforeExecution`
 * phase. Most sprites in exercises have a set of blocks that are given
 * (we call them predefined). Students are sometimes only allowed to modify a
 * specific script of a sprite.
 *
 * The pre-defined blocks check takes care of this.
 * For example:
 *
 * ```javascript
 * Itch.checkPredefinedBlocks(
 *   {
 *     spriteConfig: {
 *       Planeet: script(whenIReceive(':Start:'), setEffectTo('transparant', 0)),
 *       Enemy: {
 *         pattern: script(whenIReceive(':Start:'), setEffectTo('transparant', 0)),
 *         allowedBlocks: [forever()],
 *         allowAdditionalScripts: true,
 *       },
 *     },
 *     debug: false,
 *   },
 *   e,
 * );
 * ```
 *
 * The example above configures the test for two sprites.
 * All other sprites must be unchanged.
 *
 * For the `Planet` sprite, we allow students to change/add/remove blocks in
 * the script starting with the two blocks of the image above
 * (_When I receive broadcast "Start"_ and _Set effect transparant to 0_).
 * Students will be allowed to change blocks after the pre-defined blocks in
 * this script.
 *
 * The second sprite, `Enemy`, allows modifications to scripts starting with the
 * same blocks, but it uses the full version. With the full version, you can
 * also specify if additional scripts are allowed and limit the blocks they can
 * use (note that this allowed blocks check is not executed for additional scripts).
 *
 * See {@link PredefinedBlockConfig} for more information.
 *
 * @param userConfig The config to use.
 * @param evaluation The evaluation, from which the data is extracted.
 */
export function checkPredefinedBlocks(
  userConfig: PredefinedBlockConfig,
  evaluation: Evaluation,
): void {
  const template = evaluation.log.template;
  const submission = evaluation.log.submission;
  const e = evaluation.out;
  const config = normalizeConfig(userConfig, template);

  e.group(
    t('predefined.existing_code'),
    { visibility: 'summary', summary: t('predefined.no_changes') },
    () => {
      // We check each sprite.
      for (const target of template.targets) {
        const name = target.name;
        // If the sprite is ignored, stop now.
        if (config.ignoredSprites.includes(name)) {
          continue;
        }
        const spriteConfig = config.spriteConfig[name];
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
          if (!spriteConfig.allowAdditionalScripts && correct) {
            const result = e
              .test(t('predefined.around.name'))
              .feedback({
                wrong: t('predefined.around.wrong'),
                correct: t('predefined.around.correct'),
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
