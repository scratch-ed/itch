import { Evaluation } from '../evaluation';
import { Node } from '../new-blocks';
import { Messages } from '../testplan/hierarchy';
import { assertType } from '../utils';
import { BlockScript, OnePattern, PatternBlock, stack } from './patterns';

interface AnnotatedSubtree {
  /**
   * The pattern for this feedback.
   */
  pattern: BlockScript | OnePattern<PatternBlock>;

  /**
   * The feedback.
   */
  feedback: Messages;

  name?: string;

  substack?: AnnotatedSubtree[];
  substack2?: AnnotatedSubtree[];

  subgroup?: boolean | string;
}

/**
 * Check that the given node matches a pattern, with optional
 * custom feedback for that pattern.
 *
 * The function does not create a top level group, but does create groups
 * for loops. These are collapsed.
 */
export function checkBlocks(
  e: Evaluation,
  startNode: Node | null | undefined,
  subtrees: AnnotatedSubtree[],
): void {
  let current: Node | null | undefined = startNode;
  for (const subtree of subtrees) {
    let pattern = subtree.pattern;
    if (!(pattern instanceof BlockScript)) {
      pattern = stack(pattern);
    }

    const runnable = () => {
      assertType<BlockScript>(pattern);

      e.group
        .test(subtree.name)
        .feedback(subtree.feedback)
        .expect(current)
        .toMatchSubtree(pattern);

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
}
