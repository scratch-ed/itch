/**
 * Utilities to match a set of blocks.
 *
 * Note: You should be familiar with the hierarchy of a test plan.
 *
 * In its most basic version, these helpers provide a way of checking
 * a Scratch script against an expected script. The usefulness of these
 * functions, compared to {@link matcher/node-matcher!nodeMatchesPattern} or
 * {@link matcher/node-matcher!subTreeMatchesScript}
 * is the ability to include feedback on individual blocks.
 * For example, assume we want to use the following test:
 *
 * ```javascript
 * e.group.
 *  .test("Example test")
 *  .feedback({
 *    correct: "Yes",
 *    wrong: "No"
 *  })
 *  .expect(current)
 *  .toMatchSubtree(script(
 *     setSizeTo(100),
 *     goToLayer('front')
 *   ));
 * ```
 *
 * While it is functional, the test above does not allow us to have different
 * feedback for each block. A logical solution would be to write each check as
 * a separate test, like so:
 *
 * ```javascript
 * e.group.
 *  .test("Example test 1")
 *  .feedback({
 *    correct: "Yes",
 *    wrong: "No"
 *  })
 *  .expect(current)
 *  .toMatchSubtree(script(
 *     setSizeTo(100)
 *  ));
 *
 * current = current?.next;
 * e.group.
 *  .test("Example test 2")
 *  .feedback({
 *    correct: "Feedback 2 correct",
 *    wrong: "Feedback 2 wrong"
 *  })
 *  .expect(current)
 *  .toMatchSubtree(script(
 *     goToLayer('front')
 *  ));
 * ```
 * The main disadvantage here is that we to remember to manually go to the next
 * block `current = current?.next`.
 * This is manageable for one block, but becomes cumbersome when testing multiple
 * blocks at the same time.
 * When checking loops or conditionals, the boilerplate to set up groups is also
 * significant.
 *
 * This module attempts to provide a solution to this problem, by supplying a
 * function that takes care of most of the checks. For example, the check above
 * can be rewritten like so:
 *
 * ```javascript
 * checkBlocks(e, current, [
 *  {
 *    name: "Example test 1",
 *    feedback: {
 *      correct: "Yes",
 *      wrong: "No"
 *    },
 *    pattern: setSizeTo(100)
 *  }, {
 *   name: "Example test 2",
 *    feedback: {
 *      correct: "Feedback 2 correct",
 *      wrong: "Feedback 2 wrong"
 *    },
 *    pattern: goToLayer('front')
 *  }
 * ]);
 *
 * ```
 * Additionally, a second, related, function is provided, which allows you
 * to check that a set of blocks appears in a script, but regardless of the
 * ordering in which they appear.
 *
 * See {@link AnnotatedSubscript} for more information on how to represent
 * blocks with the metadata for these functions. Afterwards, use {@link checkBlocks}
 * to check blocks normally or use {@link checkOrderlessBlocks} if the order
 * of the blocks does not matter.
 *
 * @module
 */
import { Evaluation } from '../evaluation';
import { Node } from '../new-blocks';
import { Messages } from '../testplan/hierarchy';
import { assertType } from '../utils';
import { BlockScript, OnePattern, PatternBlock, script } from './patterns';

/**
 * A pattern annotated with some metadata.
 *
 * This interface describes a block pattern, but attaches some metadata, which
 * can be useful in deciding how the pattern should be tested. For example, the
 * feedback is included.
 */
export interface AnnotatedSubscript {
  /**
   * The pattern.
   */
  pattern: BlockScript | OnePattern<PatternBlock>;

  /**
   * The feedback for this pattern.
   */
  feedback: Messages;

  /**
   * An optional name for the test this pattern will produce.
   */
  name?: string;

  /**
   * Allow matching the first C mouth in Scratch blocks.
   */
  substack?: AnnotatedSubscript[];
  /**
   * Allow matching the second C mouth in Scratch blocks.
   */
  substack2?: AnnotatedSubscript[];
  /**
   * Allow matching the condition separately.
   */
  condition?: AnnotatedSubscript[];
  /**
   * Determine if the C mouth checks should result in a new subgroup
   * in the test results.
   * A string indicates the name of the group, while a boolean just
   * enables or disables them. `undefined` also disables groups.
   */
  subgroup?: boolean | string;
}

/**
 * Check that the given node matches a pattern, with optional
 * custom feedback for that pattern.
 *
 * The function does not create a top level group but does create groups
 * for loops. These are collapsed.
 */
export function internalCheckBlocks(
  e: Evaluation,
  startNode: Node | null | undefined,
  subtrees: AnnotatedSubscript[],
  ignoreWrong = false,
): { current: Node | null | undefined; wasCorrect: boolean } {
  let current: Node | null | undefined = startNode;
  let wasCorrect = true;
  for (const subtree of subtrees) {
    let pattern = subtree.pattern;
    if (!(pattern instanceof BlockScript)) {
      pattern = script(pattern);
    }

    const runnable = () => {
      assertType<BlockScript>(pattern);

      const newCorrect = e.group
        .test(subtree.name)
        .feedback(subtree.feedback)
        .ignoreWrong(ignoreWrong)
        .expect(current)
        .toMatchSubtree(pattern);
      wasCorrect = wasCorrect && newCorrect;

      if (subtree.condition) {
        const conditionBlocks = current?.input?.CONDITION || current;
        checkBlocks(e, conditionBlocks as Node, subtree.condition!);
      }

      if (subtree.substack) {
        const substackBlocks = current?.inputs?.SUBSTACK || current;
        checkBlocks(e, substackBlocks as Node, subtree.substack!);
      }

      if (subtree.substack2) {
        const substack2Blocks = current?.inputs?.SUBSTACK2 || current;
        checkBlocks(e, substack2Blocks as Node, subtree.substack2!);
      }
    };

    if (subtree.subgroup ?? subtree.substack) {
      let name: string;
      if (typeof subtree.subgroup === 'string') {
        name = subtree.subgroup;
      } else {
        name = 'Lus';
      }
      e.group.group(name, runnable);
    } else {
      runnable();
    }

    for (let i = 0; i < pattern.blockPatterns.length; i++) {
      current = current?.next;
    }
  }

  return { current, wasCorrect };
}

class AnyOrderContainer {
  constructor(public subScriptList: AnnotatedSubscript[]) {}
}

export function anyOrder(subScriptList: AnnotatedSubscript[]): AnyOrderContainer {
  return new AnyOrderContainer(subScriptList);
}

/**
 * A function to check orderless subscripts.
 *
 * Normally, you would use checkBlocks to verify the blocks
 * in a certain script, with an optional grouping of the tests.
 *
 * With this function, you can do the same but further allow parts
 * to be in a random order.
 *
 * This is mostly useful if a bunch of blocks in a loop needs to be executed,
 * without regard to the order in which they are executed, as long as they are
 * executed once.
 *
 * @param e
 * @param startNode
 * @param subScriptList
 */
export function checkBlocks(
  e: Evaluation,
  startNode: Node | null | undefined,
  subScriptList: Array<AnnotatedSubscript | AnyOrderContainer>,
) {
  let currentNode = startNode;
  for (const element of subScriptList) {
    // If we have a normal subscript, just pass it to the other function.
    // If this is the case, we don't need to do anything special.
    if (!(element instanceof AnyOrderContainer)) {
      const { current: nextNode } = internalCheckBlocks(e, currentNode, [element]);
      currentNode = nextNode;
      // We are done with this.
      continue;
    }
    // In the other case, we need to do fancy stuff to allow orderless.

    // Each item in the list of subtrees is identified by its position in the list.
    // Since we null out subtrees we have encountered already, we need a copy of the list.
    const nullableSubscripts: Array<AnnotatedSubscript | null> = Array.from(
      element.subScriptList,
    );

    // This works as follows: we loop n times (with n being the amount of subscripts)
    // and try to match any subscript during each iteration.
    // When a subscript matches, we abort the current iteration and null out it in the
    // list of available subscripts.
    for (let i = 0; i < element.subScriptList.length; i++) {
      for (let j = 0; j < element.subScriptList.length; j++) {
        // If the item is null, it was already used, so skip.
        if (nullableSubscripts[j] === null) {
          continue;
        }

        // Test the item.
        const { current: potentialNextCurrent, wasCorrect } = internalCheckBlocks(
          e,
          currentNode,
          [nullableSubscripts[j]!],
          true,
        );

        if (wasCorrect) {
          currentNode = potentialNextCurrent;
          nullableSubscripts[j] = null;
          // We found a block, so stop looking.
          break;
        }
      }
    }

    // Now, we will finally do a check for the remaining items.
    for (let i = 0; i < element.subScriptList.length; i++) {
      // If the item is null, it was already used, so skip.
      if (nullableSubscripts[i] === null) {
        continue;
      }

      internalCheckBlocks(e, null, [nullableSubscripts[i]!], false);
    }
  }
}
