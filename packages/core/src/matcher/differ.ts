import { Evaluation } from '../evaluation';
import { Node } from '../new-blocks';
import { Messages } from '../testplan/hierarchy';
import { BlockStack, OnePattern, PatternBlock, stack } from './patterns';

interface AnnotatedSubtree {
  /**
   * The pattern for this feedback.
   */
  pattern: BlockStack | OnePattern<PatternBlock>;

  /**
   * The feedback.
   */
  feedback: Messages;

  name?: string;

  substack?: AnnotatedSubtree[];
  substack2?: AnnotatedSubtree[];

  subgroup?: boolean;
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
    if (!(pattern instanceof BlockStack)) {
      pattern = stack(pattern);
    }

    e.group
      .test(subtree.name)
      .feedback(subtree.feedback)
      .expect(current)
      .toMatchSubtree(pattern);

    // If there is a substack, use it.
    let sub1;
    if (subtree.substack) {
      const substackBlocks = current?.inputs?.SUBSTACK || current;
      sub1 = () => {
        checkBlocks(e, substackBlocks as Node, subtree.substack!);
      };
    }
    if (sub1) {
      if (subtree.subgroup ?? true) {
        e.group.group('Lus', sub1);
      } else {
        sub1();
      }
    }
    // The IfThenElse block has a second substack.
    let sub2;
    if (subtree.substack2) {
      sub2 = () => {
        checkBlocks(e, current?.inputs?.SUBSTACK2 as Node, subtree.substack2!);
      };
    }
    if (sub2) {
      if (subtree.subgroup ?? true) {
        e.group.group('Lus', sub2);
      } else {
        sub2();
      }
    }

    for (let i = 0; i < pattern.blockPatterns.length; i++) {
      current = current?.next;
    }
  }
}
