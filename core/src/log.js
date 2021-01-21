import { last } from 'underscore';

/**
 * Our own version of a variable. Basically a copy of a {@link Variable}.
 */
export class LoggedVariable {
  /**
   * @param {Variable} variable - The source to copy from.
   */
  constructor(variable) {
    this.id = variable.id;
    this.name = variable.name;
    this.type = variable.type;
  }
}

/**
 * Our own version of a sprite. Basically a copy of a {@link RenderedTarget}.
 */
export class LoggedSprite {
  /**
   * @param {RenderedTarget} target - The source to extract information from.
   * @param {Target[]} targets - Other targets.
   */
  constructor(target, targets) {
    // Copy some properties
    this.id = target.id;
    this.name = target.getName();
    this.x = target.x;
    this.y = target.y;
    this.direction = target.direction;
    this.isStage = target.isStage;
    this.size = target.size;
    this.visible = target.visible;
    this.tempo = target.tempo;
    this.draggable = target.draggable;
    this.volume = target.volume;
    // TODO: remove variables above.
    this.properties = target.toJSON();
    this.time = target.runtime.currentMSecs;
    this.type = target.type;

    // Copy variables.
    this.variables = [];
    for (const varName of target.variables) {
      this.variables.push(new LoggedVariable(target.lookupVariableById(varName)));
    }

    // Copy sprite information.
    this.costume = target.getCurrentCostume().name;
    this.costumeSize = target.getCurrentCostume().size;

    this.isTouchingEdge = target.isTouchingEdge();
    this.bounds = target.getBounds();

    // Get all targets that touch this one.
    this.touchingSprites = [];
    for (const otherTarget of targets) {
      if (otherTarget.id === this.id) {
        // Skip self.
        continue;
      }
      this.touchingSprites.push({
        name: otherTarget.getName(),
        value: target.isTouchingSprite(otherTarget.getName())
      });
    }
    /** @deprecated */
    this.isTouchingSprite = this.touchingSprites;

    // Get blocks.
    this.blocks = target.blocks._blocks;
    this.scriptes = target.blocks.getScripts();
  }

  /**
   * Check if this sprite touches another sprite.
   *
   * @param {string} name The name of the other sprite.
   *
   * @return {boolean}
   */
  touches(name) {
    return this.touchingSprites.find(ts => ts.name === name).value;
  }
}

/**
 * One captured moment during execution.
 *
 * A frame consists of a snapshot of the current state of the sprites
 * at the moment the frame was saved.
 *
 * A frame is created from a block, and extracts information from the
 * Scratch VM.
 *
 * @example
 * let frame = new Frame('looks_nextcostume');
 */
export class Frame {
  /**
   * When a new frame is created, information from the current state of the targets is saved. Some properties, like if the target is touching another target,
   * are calculated before being saved.
   *
   * @param {VirtualMachine} scratchVm - The scratch virtual machine.
   * @param {string} block - The block that triggered the fame saving.
   * @param {object} meta - Some metadata about the execution.
   */
  constructor(scratchVm, block, meta) {

    /**
     * The timestamp of the frame.
     * TODO: investigate using currentMSecs instead.
     * @type {number}
     */
    this.time = Date.now() - meta.start;

    /**
     * The name of the block that triggerd this frame.
     * @type {string}
     */
    this.block = block;
    // TODO: what is this used for.
    this.type = block;

    /**
     * The targets saved at this moment in the VM.
     * @type {LoggedSprite[]}
     */
    this.sprites = [];

    // For now we only save rendered targets.

    for (const target of scratchVm.runtime.targets) {

      // eslint-disable-next-line no-undef
      if (!(target instanceof RenderedTarget)) {
        console.warn('Found non rendered target, ignoring...');
        continue;
      }

      this.sprites.push(new LoggedSprite(target, scratchVm.runtime.targets));
    }
  }

  /**
   * @param {string} spriteName - The name of the sprite that has to be returned.
   *
   * @returns {LoggedSprite | null} sprite - The found sprite or null if none was found.
   */
  getSprite(spriteName) {
    for (const sprite of this.sprites) {
      if (sprite.name === spriteName) {
        return sprite;
      }
    }
    return null;
  }

  /**
   * Check if two sprites were touching when the frame was captured.
   *
   * An exception will be thrown if the first sprite does not exist.
   *
   * @param {string} first - The first sprite.
   * @param {string} second - The second sprite.
   *
   * @return {boolean} If they were touching ir not.
   */
  areTouching(first, second) {
    const firstSprite = this.getSprite(first);

    if (firstSprite === null) {
      throw new TypeError(`Cannot check non existing sprite ${first}`);
    }

    return firstSprite.touches(second);
  }

  /**
   * @deprecated
   */
  isTouching(spriteName1, spriteName2) {
    this.areTouching(spriteName1, spriteName2);
  }
}

/**
 * @typedef {Object} Constraints
 * @property {number|null} before
 * @property {number|null} after
 * @property {string|null} type
 */

/**
 * Search for frames with the given constraints.
 *
 * @param {Frame[]} frames - Frames to search.
 * @param {Constraints} constraints - Values to filter on.
 *
 * @return {Frame[]} A new instance of this array with the filtered values.
 */
export function searchFrames(frames, constraints) {
  const before = constraints.before || last(this);
  const after = constraints.after || 0;
  const type = constraints.type || null;

  return frames.filter(f => {
    return f.time >= after && f.time <= before && (f.type === type || type === null);
  });
}

/**
 * Saves render information.
 * TODO: review
 */
export class LogRenderer {
  constructor() {
    this.index = 0;
    this.lines = [];
    this.color = null;
    this.points = [];
    this.responses = [];
  }
}

/**
 * Saves block information.
 * TODO: review
 */
export class LogBlocks {
  constructor() {
    this.blocks = {};
  }

  push(block) {
    if (!this.blocks[block]) {
      this.blocks[block] = 0;
    }
    this.blocks[block]++;
  }

  /**
   * Check if the blocks contain a loop.
   * @return {boolean}
   */
  containsLoop() {
    return this.blocks.some(key => key === 'control_repeat' || key === 'control_forever');
  }

  /**
   * Check if the blocks contain a certain block.
   * @param {string} blockName The name of the block to search for.
   * @return {boolean}
   */
  containsBlock(blockName) {
    return this.blocks.some(key => key === blockName);
  }

  countExecutions(name, blocks) {
    for (const key in blocks) {
      if (key === name) return blocks[key];
    }
    return 0;
  }

  numberOfExecutions(blockName) {
    return this.countExecutions(blockName, this.blocks);
  }
}
