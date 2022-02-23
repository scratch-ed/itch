import { Node } from '../new-blocks';
import { ANYTHING, Pattern, PatternBlock, ValuePattern } from './patterns';

function matchesOneStack(node: Node, patternStack: Pattern<PatternBlock>[]) {
  let currentNode: Node | null = node;
  for (const pattern of patternStack) {
    // If the current node is null, there is no block, so fail.
    if (currentNode === null) {
      return false;
    }
    // Check if the node matches the pattern.
    if (!matchesBlockPattern(currentNode, pattern)) {
      return false;
    }

    currentNode = currentNode.next;
  }

  // The stack matches the pattern.
  return true;
}

/**
 * Check if the block stack matches with one of the provided patterns.
 *
 * The matching will start
 *
 * @param node
 * @param blockPattern
 */
export function matchesStackPattern(
  node: Node,
  ...blockPattern: Pattern<PatternBlock>[][]
) {
  return blockPattern.some((p) => matchesOneStack(node, p));
}

// We don't care about the actual value here.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function matchesValue(value: string, valuePattern: ValuePattern<any>): boolean {
  // If anything, we are good.
  if (valuePattern === ANYTHING) {
    return true;
  }

  // If a choice, it must be inside.
  if (Array.isArray(valuePattern)) {
    return valuePattern.map((v) => v.toString().toLowerCase()).includes(value);
  }

  // If a function, call it.
  if (typeof valuePattern === 'function') {
    return valuePattern(value);
  }

  // It must be a primitive.
  return value.toLowerCase() === valuePattern.toString().toLowerCase();
}

function matchesOnePattern(node: Node, pattern: Pattern<PatternBlock>): boolean {
  // We have a wildcard.
  if (pattern === ANYTHING) {
    return true;
  }

  // If the opcode doesn't match, end it now.
  if (node.opcode !== pattern.opcode) {
    return false;
  }

  // Check if all required inputs match.
  if (pattern.inputs) {
    for (const [field, valuePattern] of Object.entries(pattern.inputs)) {
      const value = node.input[field];

      if (value === undefined) {
        return false;
      }

      // The value is another Node, so we must match blocks.
      if (typeof value === 'object') {
        if (!matchesStackPattern(value, ...valuePattern)) {
          // The blocks don't match, so abort.
          return false;
        } else {
          // The blocks match.
          continue;
        }
      }

      if (!matchesValue(value, valuePattern)) {
        return false;
      }
    }
  }

  // Check if all required fields match.
  if (pattern.fields) {
    for (const [field, valuePattern] of Object.entries(pattern.fields)) {
      const value = node.fields[field];

      if (value === undefined) {
        return false;
      }

      // The value is another Node, so we must match blocks.
      if (typeof value === 'object') {
        if (!matchesStackPattern(value, ...valuePattern)) {
          // The blocks don't match, so abort.
          return false;
        } else {
          // The blocks match.
          continue;
        }
      }

      if (!matchesValue(value, valuePattern)) {
        return false;
      }
    }
  }

  // The block matches!
  return true;
}

/**
 * Check if a node matches with a pattern.
 *
 * Note that only the node itself and its children are checked. For example,
 * all blocks inside a loop will be checked. The next block however, will not
 * be checked. The caller should get the next pattern and node, and check if
 * those match.
 *
 * We support
 *
 * @param node
 * @param pattern
 */
export function matchesBlockPattern(
  node: Node,
  ...pattern: Pattern<PatternBlock>[]
): boolean {
  return pattern.some((p) => matchesOnePattern(node, p));
}
