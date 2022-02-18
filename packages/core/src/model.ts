import { asTree, Node } from './new-blocks';
import { Position } from './lines';
import { ensure } from './utils';

export type VariableType = '' | 'list' | 'broadcast_msg';

export class ScratchVariable {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly type: VariableType,
    readonly value: unknown,
  ) {}

  static fromSb3File(
    id: string,
    type: VariableType,
    data: Array<unknown>,
  ): ScratchVariable {
    return new ScratchVariable(id, data[0] as string, type, data[1]);
  }
}

export interface ScratchMutation {
  tagName: string;
  children: Array<unknown>;
  proccode: string;
  argumentids: string;
}

/**
 * Generic interface for Scratch blocks.
 */
export interface ScratchBlock {
  readonly id: string;
  readonly opcode: string;
  readonly next?: string;
  readonly parent?: string;
  readonly inputs: Record<string, Array<unknown>>;
  readonly fields: Record<string, Array<unknown>>;
  readonly shadow: boolean;
  readonly topLevel: boolean;
  readonly x?: number;
  readonly y?: number;
  readonly mutation?: ScratchMutation;
}

class Sb3ScratchBlock implements ScratchBlock {
  /**
   *
   * @param id
   * @param opcode A string naming the block. The opcode of a "core" block may
   * be found in the Scratch source code here or here for shadows, and the opcode
   * of an extension's block may be found in the extension's source code.
   * @param next The ID of the following block if present.
   * @param parent If the block is a stack block and is preceded, this is the ID
   * of the preceding block. If the block is the first stack block in a C mouth,
   * this is the ID of the C block. If the block is an input to another block,
   * this is the ID of that other block. Otherwise it is undefined.
   * @param inputs An object associating names with arrays representing inputs
   * into which reporters may be dropped and C mouths. The first element of each
   * array is 1 if the input is a shadow, 2 if there is no shadow, and 3 if
   * there is a shadow but it is obscured by the input. The second is either the
   * ID of the input or an array representing it as described below. If there is
   * an obscured shadow, the third element is its ID or an array representing it.
   * @param fields An object associating names with arrays representing fields.
   * The first element of each array is the field's value which may be followed
   * by an ID.
   * @param shadow True if this is a shadow and false otherwise.
   * A shadow is a constant expression in a block input which can be replaced
   * by a reporter; Scratch internally considers these to be blocks although they
   * are not usually thought of as such.
   * This means that a shadow is basically the place holder of some variable in blocks
   * while they are in the toolbox. https://groups.google.com/g/blockly/c/bXe4iEaVSao
   * @param topLevel False if the block has a parent and true otherwise.
   * @param x X coordinate in the code area if top-level.
   * @param y Y coordinate in the code area if top-level.
   * @param mutation Mutation data if a mutation.
   */
  constructor(
    readonly id: string,
    readonly opcode: string,
    readonly next: string | undefined,
    readonly parent: string | undefined,
    readonly inputs: Record<string, Array<unknown>>,
    readonly fields: Record<string, Array<unknown>>,
    readonly shadow: boolean,
    readonly topLevel: boolean,
    readonly x?: number,
    readonly y?: number,
    readonly mutation?: ScratchMutation,
  ) {}

  /**
   * Get the procedure name of the procedure being called.
   * If the block is not a procedure call, an error will be thrown.
   */
  get calledProcedureName(): string {
    if (this.opcode !== 'procedures_call') {
      throw new Error('Cannot get called procedure name from non procedure call.');
    }

    return this.mutation!.proccode;
  }

  toString(): string {
    return `Block ${this.id} (${this.opcode})`;
  }
}

export function blockFromSb3(id: string, data: Record<string, unknown>): ScratchBlock {
  return new Sb3ScratchBlock(
    id,
    data.opcode as string,
    data.next as string,
    data.parent as string,
    data.inputs as Record<string, Array<unknown>>,
    data.fields as Record<string, Array<unknown>>,
    data.shadow as boolean,
    data.topLevel as boolean,
    data.x as number,
    data.y as number,
    data.mutation as ScratchMutation,
  );
}

/**
 * @see https://en.scratch-wiki.info/wiki/Scratch_File_Format#Comments
 */
export class ScratchComment {
  constructor(
    readonly id: string,
    readonly blockId: string,
    readonly x: number,
    readonly y: number,
    readonly height: number,
    readonly width: number,
    readonly minimized: boolean,
    readonly text: string,
  ) {}
}

/**
 * @see https://en.scratch-wiki.info/wiki/Scratch_File_Format#Assets
 */
interface ScratchAsset {
  assetId: string;
  name: string;
  md5ext: string;
  dataFormat: string;
}

/**
 * @see https://en.scratch-wiki.info/wiki/Scratch_File_Format#Costumes
 */
export interface ScratchCostume extends ScratchAsset {
  bitmapResolution: number | null;
  rotationCenterX: number;
  rotationCenterY: number;
}

/**
 * @see https://en.scratch-wiki.info/wiki/Scratch_File_Format#Sounds
 */
export interface ScratchSound extends ScratchAsset {
  rate: number;
  sampleCount: number;
}

/**
 * The base sprite class.
 *
 * @see https://en.scratch-wiki.info/wiki/Scratch_File_Format#Targets
 */
export class ScratchTarget {
  constructor(
    readonly name: string,
    readonly variables: ScratchVariable[],
    readonly blocks: ScratchBlock[],
    readonly comments: ScratchComment[] | undefined,
    readonly currentCostume: number,
    readonly costumes: ScratchCostume[] | undefined,
    readonly volume: number,
    readonly layerOrder: number,
  ) {}

  getCurrentCostume(): ScratchCostume {
    return this.costumes![this.currentCostume];
  }

  /**
   * Get an object that can be used to compare against other sprites
   * from a similar project, e.g. to compare if the user changed something.
   */
  comparableObject(): { name: string } {
    return {
      name: this.name,
    };
  }

  /**
   * Get all blocks as a set of trees.
   * You can optionally pass a list of tree roots to consider; other blocks
   * will be ignored.
   */
  blockTree(blocks?: ScratchBlock[]): Set<Node> {
    return asTree(this, blocks);
  }

  variable(name: string): ScratchVariable | undefined {
    return this.variables.find((v) => v.name === name);
  }

  block(id: string): ScratchBlock {
    return ensure(this.blocks.find((b) => b.id === id));
  }

  /** @deprecated */
  getVariable(name: string): ScratchVariable | undefined {
    return this.variable(name);
  }
}

export type VideoState = 'on' | 'on-flipped' | 'off';

export class ScratchStage extends ScratchTarget {
  constructor(
    name: string,
    variables: ScratchVariable[],
    blocks: ScratchBlock[],
    comments: ScratchComment[] | undefined,
    currentCostume: number,
    costumes: ScratchCostume[] | undefined,
    volume: number,
    layerOrder: number,
    readonly tempo: number,
    readonly videoTransparency: number,
    readonly videoState: VideoState,
  ) {
    super(
      name,
      variables,
      blocks,
      comments,
      currentCostume,
      costumes,
      volume,
      layerOrder,
    );
  }
}

export type RotationStyle = 'all around' | 'left-right' | "don't rotate";
export type Bounds = { left: number; right: number; top: number; bottom: number };

export class ScratchSprite extends ScratchTarget {
  constructor(
    name: string,
    variables: ScratchVariable[],
    blocks: ScratchBlock[],
    comments: ScratchComment[] | undefined,
    currentCostume: number,
    costumes: ScratchCostume[] | undefined,
    volume: number,
    layerOrder: number,
    readonly visible: boolean,
    readonly x: number,
    readonly y: number,
    readonly size: number,
    readonly direction: number,
    readonly draggable: boolean,
    readonly rotationStyle: RotationStyle,
    readonly bounds?: Bounds,
  ) {
    super(
      name,
      variables,
      blocks,
      comments,
      currentCostume,
      costumes,
      volume,
      layerOrder,
    );
  }

  touchesPosition(pos: Position, padding = 0): boolean {
    const { left, right, bottom, top } = this.bounds!;
    return (
      left - padding < pos.x &&
      pos.x < right + padding &&
      bottom - padding < pos.y &&
      pos.y < top + padding
    );
  }

  get position(): Position {
    return { x: this.x, y: this.y };
  }

  /**
   * Get the name of the current costume.
   */
  get costume(): string | undefined {
    return this.costumes?.[this.currentCostume]?.name;
  }
}
