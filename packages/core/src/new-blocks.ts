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

/**
 * Convert one block to a tree node.
 */
function blockToNode(block: ScratchBlock, blockmap: Map<string, ScratchBlock>): Node {
  const next = getOrNull(block.next, blockmap);
  return {
    opcode: block.opcode,
    next: next,
    input: block.inputs,
    fields: block.fields,
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
