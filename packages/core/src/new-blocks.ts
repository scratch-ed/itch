import isNumber from 'lodash-es/isNumber';
import { ensure } from './utils';
import { ScratchBlock, ScratchMutation, ScratchTarget } from './model';

function getOrNull(
  blockId: string | undefined | null,
  blockmap: Map<string, ScratchBlock>,
): Node | null {
  if (blockId) {
    const parentBlock = ensure(blockmap.get(blockId));
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return blockToNode(parentBlock, blockmap);
  } else {
    return null;
  }
}

function convertInput(inputArray: unknown[], blockmap: Map<string, ScratchBlock>) {
  // We ignore shadows, as they are not that relevant for us.
  // As such, we always convert the second element in the input array.
  if (Array.isArray(inputArray[1])) {
    const input = inputArray[1];
    return input[1];
  } else {
    // ID of a block.
    const id = inputArray[1];
    const block = blockmap.get(<string>id);
    if (!block) {
      return undefined;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      return blockToNode(block, blockmap);
    }
  }
}

function convertMutation(mutation?: ScratchMutation): string | null {
  if (!mutation) {
    return null;
  }

  return mutation.proccode;
}

export interface Node {
  opcode: string;
  next: Node | null;
  input: Record<string, unknown>;
  fields: Record<string, unknown>;
  mutation: string | null;
}

function convertFields(
  fields: Record<string, unknown[]> | null,
): Record<string, unknown> {
  const object: Record<string, unknown> = {};
  if (!fields) {
    return object;
  }
  for (const [name, description] of Object.entries(fields)) {
    object[name] = description[0];
  }
  return object;
}

/**
 * Convert one block to a tree node.
 */
function blockToNode(block: ScratchBlock, blockmap: Map<string, ScratchBlock>): Node {
  const next = getOrNull(block.next, blockmap);

  const input: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(block.inputs || {})) {
    const converted = convertInput(value, blockmap);
    if (value[0] === 1 && !converted) {
      continue;
    }
    input[key] = converted;
    if (isNumber(input[key])) {
      input[key] = (<number>input[key]).toString();
    }
  }

  return {
    opcode: block.opcode,
    next: next,
    input: input,
    fields: convertFields(block.fields),
    mutation: convertMutation(block.mutation),
  };
}

/**
 * Convert all blocks from a sprite to a list of trees, where each tree is
 * a set of attached blocks.
 *
 * @param sprite
 * @param blocks - Top level blocks to filter.
 */
export function asTree(
  sprite: ScratchTarget,
  blocks: ScratchBlock[] = sprite.blocks.filter((b) => b.topLevel),
): Set<Node> {
  const blockMap = new Map(sprite.blocks.map((i) => [i.id, i]));

  // Find all top-level blocks.
  const filtered = blocks.filter((b) => b.topLevel).map((b) => blockToNode(b, blockMap));

  return new Set(filtered);
}
