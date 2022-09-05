import { isNode, Node } from '../new-blocks';
import { assertType } from '../utils';
import {
  ANYTHING,
  BlockScript,
  isReporterBlock,
  NOTHING,
  OnePattern,
  OneValuePattern,
  Pattern,
  PatternBlock,
  script,
  ValuePattern,
} from './patterns';

// We don't care about the actual value here.
/**
 * Match a value to one value pattern.
 *
 * This means there is only one pattern to match against.
 * See `valueMatchesValuePatterns` if you want to match a value against a list
 * of possible patterns.
 *
 *
 *
 *
 *
 * @param value
 * @param valuePattern
 */
function valueMatchesOneValuePattern(
  value: string | Node | undefined | null,
  valuePattern: OneValuePattern<unknown>,
): boolean {
  // If a function, call it.
  if (typeof valuePattern === 'function') {
    return valuePattern(value);
  }

  // 1. If the value is undefined or null, the pattern needs to be nothing.
  //    Conversely, if the pattern is nothing, the value needs to be undefined
  //    or null. This will handle both cases. If only one condition is satisfied,
  //    we cannot match.
  if (value === undefined || value === null || valuePattern === NOTHING) {
    return (value === undefined || value === null) && valuePattern === NOTHING;
  }

  // 2. If the pattern is a wildcard, accept everything.
  //    This does imply that null or undefined is not accepted.
  if (valuePattern === ANYTHING) {
    return true;
  }

  // The pattern could be a reporter block.
  if (isReporterBlock(valuePattern)) {
    valuePattern = script(valuePattern);
  }

  if (valuePattern instanceof BlockScript) {
    // If the pattern is a stack, the value must be a node.
    if (!isNode(value)) {
      return false;
    }
    return subtreeMatchesOneScript(value, valuePattern);
  }

  if (isNode(value)) {
    // This should not happen.
    console.warn('Unexpected node as value in pattern match.');
    return false;
  }

  assertType<string>(valuePattern);
  return value?.toLowerCase() === valuePattern.toString().toLowerCase();
}

// We don't care about the actual value here.
function valueMatchesValuePatterns<T>(
  value: string | Node | undefined | null,
  valuePattern: ValuePattern<T>,
): boolean {
  if (!Array.isArray(valuePattern)) {
    valuePattern = [valuePattern];
  }

  return valuePattern.some((p) => valueMatchesOneValuePattern(value, p));
}

function matchesFieldsOrInputs(
  fieldOrInputs: Record<string, string | Node | undefined>,
  patterns: Record<string, ValuePattern<unknown>>,
): boolean {
  for (const [name, valuePattern] of Object.entries(patterns)) {
    // If the value does not exist, we don't match.
    if (!(name in fieldOrInputs)) {
      return false;
    }
    const actualValue = fieldOrInputs[name];
    if (!valueMatchesValuePatterns(actualValue, valuePattern)) {
      return false;
    }
  }

  // It matches.
  return true;
}

/**
 * Matches a node against a single pattern, meaning the choices (or) have
 * been removed.
 *
 * @param node The node to match.
 * @param pattern
 */
function matchesOnePattern(
  node: Node | null | undefined,
  pattern: OnePattern<PatternBlock>,
): boolean {
  // If the pattern is a function, call it.
  if (typeof pattern === 'function') {
    return pattern(node);
  }

  if (node === null || node === undefined || pattern === NOTHING) {
    return (node === null || node === undefined) && pattern === NOTHING;
  }

  // If the pattern is a wildcard, we match.
  if (pattern === ANYTHING) {
    return true;
  }

  // If the opcode doesn't match, end it now.
  if (node.opcode !== pattern.opcode) {
    return false;
  }

  // Check if all required inputs match.
  if (pattern.inputs && !matchesFieldsOrInputs(node.inputs, pattern.inputs)) {
    return false;
  }

  // Check if all required fields match.
  if (pattern.fields && !matchesFieldsOrInputs(node.fields, pattern.fields)) {
    return false;
  }

  // Check if the mutation is correct.
  if (pattern.mutation) {
    if (!valueMatchesValuePatterns(node.mutation, pattern.mutation)) {
      return false;
    }
  }

  if (pattern.argumentList) {
    // The lists are not the same length, or the actual node has no arguments.
    if (pattern.argumentList.length !== node.arguments?.length) {
      return false;
    }
    // Check each argument.
    for (let i = 0; i < pattern.argumentList.length; i++) {
      if (!valueMatchesValuePatterns(node.arguments[i], pattern.argumentList[i])) {
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
 * This only checks the current node (and its children), but not the
 * next node (since you can also only pass one pattern).
 *
 * @param node The node to match.
 * @param pattern The pattern to match the node to.
 */
export function nodeMatchesPattern(
  node: Node | null | undefined,
  pattern: Pattern<PatternBlock>,
): boolean {
  if (!Array.isArray(pattern)) {
    pattern = [pattern];
  }
  return pattern.some((p) => matchesOnePattern(node, p));
}

/**
 * Check if the subtree of blocks starting with `Node` match with the given
 * pattern of black stacks.
 *
 * Note that while the node can be null or undefined, these are only accepted
 * if the pattern is Never.
 *
 * TODO: lookup and potentially implement a better tree matching algorithm
 *
 * @param node The root of the subtree to check.
 * @param pattern The pattern to check against.
 */
export function subtreeMatchesOneScript(
  node: Node | null | undefined,
  pattern: OnePattern<BlockScript>,
) {
  if (pattern === NOTHING) {
    return node === null || node === undefined;
  }

  // If the pattern is a wildcard, we match.
  if (pattern === ANYTHING) {
    return true;
  }

  if (typeof pattern === 'function') {
    throw new Error('You cannot pass a function to a subtree match function.');
  }

  let currentNode: Node | null | undefined = node;
  for (const blockPatterns of pattern.blockPatterns) {
    // Check if the node matches the pattern.
    if (!nodeMatchesPattern(currentNode, blockPatterns)) {
      return false;
    }

    currentNode = currentNode?.next;
  }

  // The stack matches the pattern.
  return true;
}

export function subTreeMatchesScript(
  node: Node | null | undefined,
  pattern: Pattern<BlockScript>,
) {
  if (!Array.isArray(pattern)) {
    pattern = [pattern];
  }

  return pattern.some((p) => subtreeMatchesOneScript(node, p));
}
