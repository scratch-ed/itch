/* Copyright (C) 2019 Ghent University - All Rights Reserved */
import { isNumber } from 'lodash-es/lang.js';

export function containsLoop(blocks) {
  for (const key in blocks) {
    if (key === 'control_repeat' || key === 'control_forever') return true;
  }
  return false;
}

export function containsBlock(name, blocks) {
  for (const key in blocks) {
    if (key === name) return true;
  }
  return false;
}

export function countExecutions(name, blocks) {
  for (const key in blocks) {
    if (key === name) return blocks[key];
  }
  return 0;
}

function getOrNull(blockId, blockmap, sprite) {
  if (blockId) {
    const parentBlock = blockmap.get(blockId);
    return blockToNode(parentBlock, blockmap, sprite);
  } else {
    return null;
  }
}

function convertInput(inputArray, blockmap, sprite) {
  // We ignore shadows, as they are not that relevant for us.
  // As such, we always convert the second element in the input array.
  if (Array.isArray(inputArray[1])) {
    const input = inputArray[1];
    return input[1];
  } else {
    // ID of a block.
    const id = inputArray[1];
    return blockToNode(id, blockmap, sprite);
  }
}

function convertMutation(mutation) {
  if (!mutation) {
    return null;
  }

  return mutation.proccode;
}

/**
 * Convert one block to a tree node.
 *
 * @param {Sb3Block} block
 * @param {Sb3Target} sprite
 * @param {Map<string,Sb3Block>} blockmap
 *
 * @return {Object}
 */
function blockToNode(block, blockmap, sprite) {
  const next = getOrNull(block.next, blockmap, sprite);

  const input = {};
  for (const [key, value] of Object.entries(block.inputs || {})) {
    input[key] = convertInput(value, blockmap, sprite);
    if (isNumber(input[key])) {
      input[key] = input[key].toString();
    }
  }

  return {
    opcode: block.opcode,
    next: next,
    input: input,
    mutation: convertMutation(block.mutation),
  };
}

/**
 * Convert all blocks from a sprite to a list of trees, where each tree is
 * a set of attached blocks.
 *
 * @param {Sb3Target} sprite
 * @param {Sb3Block[]} blocks - Top level blocks to filter.
 *
 * @return {Set<Object>}
 */
export function asTree(
  sprite,
  blocks = sprite.blocks.filter((b) => b.topLevel),
) {
  const blockMap = new Map(sprite.blocks.map((i) => [i.id, i]));

  // Find all top-level blocks.
  const filtered = blocks
    .filter((b) => b.topLevel)
    .map((b) => blockToNode(b, blockMap, sprite));

  return new Set(filtered);
}
