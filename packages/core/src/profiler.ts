import { Node } from './blocks';
import { ScratchBlock } from './model';

export interface ProfileEventData {
  /**
   * THe ID of the block that executed.
   */
  readonly blockId: string;

  /**
   * The name of the target that executed the block.
   */
  readonly target: string;

  /**
   * Get the executed block as an instance of a `ScratchBlock`.
   * This method is expensive, so only use it if necessary.
   * The method is memoized, so calling it multiple times is no problem.
   */
  block(): ScratchBlock;

  /**
   * Get the executed block as an instance of a `Node`.
   * This allows for easy matching against blocks.
   * This method is expensive, so only use it if necessary.
   * The method is memoized, so calling it multiple times is no problem.
   */
  node(): Node;
}
