import { ensure } from './utils';
import { ScratchBlock, ScratchMutation, ScratchTarget } from './model';

function getOrNull(
  blockId: string | undefined | null,
  blockmap: Map<string, ScratchBlock>,
): Node | null {
  if (blockId) {
    const parentBlock = ensure(blockmap.get(blockId));
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return asNode(parentBlock, blockmap);
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
  inputs: Record<string, string | Node | undefined>;
  /** @deprecated */
  input: Record<string, string | Node | undefined>;
  fields: Record<string, string>;
  mutation: string | null;
  /**
   * A list of arguments if the block is a mutation call.
   *
   * Note that in Scratch itself, these values are also
   * in the `inputs` field. Here however, we remove those,
   * to prevent duplicates.
   */
  arguments?: Array<string | Node>;
}

export function isNode(object: unknown): object is Node {
  return object !== null && typeof object === 'object' && 'opcode' in object;
}

/**
 * Convert the input field. If it is a block, get the block.
 *
 * @param inputArray
 * @param blockmap
 */
function convertInput(
  inputArray: unknown[],
  blockmap: Map<string, ScratchBlock>,
): string | Node | undefined {
  // We ignore shadows, as they are not that relevant for us.
  // As such, we always convert the second element in the input array.
  if (Array.isArray(inputArray[1])) {
    const input = inputArray[1];
    return input[1]?.toString();
  } else {
    // ID of a block.
    const id = inputArray[1];
    const block = blockmap.get(<string>id);
    if (!block) {
      return undefined;
    } else {
      return asNode(block, blockmap);
    }
  }
}

function convertFields(fields: Record<string, unknown[]> | null): Record<string, string> {
  const object: Record<string, string> = {};
  if (!fields) {
    return object;
  }
  for (const [name, description] of Object.entries(fields)) {
    object[name] = description[0] as string;
  }
  return object;
}

function convertProcedureArguments(
  opcode: string,
  mutation: string | null,
  inputs?: Record<string, string | Node | undefined>,
  argumentList?: string[],
): Array<string | Node> | undefined {
  if (opcode !== 'procedures_call' || !mutation || !inputs) {
    // This is not a procedure call, or it is one without any arguments,
    // so just do nothing.
    return undefined;
  }

  // The mutation looks like this: "label 1 part 2 %s %n label 3 %b"
  // We split on " %", to extract the different parts.
  // Multiple subsequent labels should not be possible.
  const convertedArguments = mutation.split(/ ?(%b|%n|%s) ?/g).filter((s) => s !== '');
  const mergedArguments: Array<string | Node> = [];

  // Do a preliminary check to see if stuff makes sense or not.

  let argumentIndex = 0;
  for (
    let mutationIndex = 0;
    mutationIndex < convertedArguments.length;
    mutationIndex++
  ) {
    const mutationArg = convertedArguments[mutationIndex];
    if (mutationArg == '%s' || mutationArg == '%b' || mutationArg == '%n') {
      // Get the actual param from the input.
      const inputId = ensure(argumentList)[argumentIndex++];
      const value = inputs[inputId];
      if (!value) {
        throw new Error('Procedure call has a non-existing input value');
      }
      mergedArguments[mutationIndex] = value;
    } else {
      mergedArguments[mutationIndex] = mutationArg;
    }
  }

  return mergedArguments;
}

/**
 * Convert one block to a tree node.
 */
export function asNode(block: ScratchBlock, blockmap: Map<string, ScratchBlock>): Node {
  const next = getOrNull(block.next, blockmap);

  const inputs: Record<string, string | Node | undefined> = {};
  for (const [key, value] of Object.entries(block.inputs)) {
    inputs[key] = convertInput(value, blockmap);
  }
  const mutation = convertMutation(block.mutation);

  return {
    opcode: block.opcode,
    next: next,
    inputs: inputs,
    input: inputs,
    fields: convertFields(block.fields),
    mutation: mutation,
    arguments: convertProcedureArguments(
      block.opcode,
      mutation,
      inputs,
      block.mutation?.argumentids,
    ),
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
  const filtered = blocks.filter((b) => b.topLevel).map((b) => asNode(b, blockMap));

  return new Set(filtered);
}

/**
 * Walk all nodes in the given tree and call the callback for each node.
 *
 * @param node The root of the tree to walk.
 * @param walker The callback, which will be called for each node.
 */
export function walkNodes(node: Node, walker: (n: Node) => void): void {
  walker(node);
  while (node.next) {
    if (node.inputs.SUBSTACK) {
      walkNodes(node.inputs.SUBSTACK as Node, walker);
    }
    if (node.inputs.SUBSTACK2) {
      walkNodes(node.inputs.SUBSTACK2 as Node, walker);
    }
    node = node.next;
    walker(node);
  }
}
