import { last } from 'underscore';
import { containsBlock, containsLoop, countExecutions } from './blocks';
import { findSquares, findTriangles, mergeLines, dist, distSq } from './lines';

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
    for (const varName of Object.keys(target.variables || {})) {
      this.variables.push(new LoggedVariable(target.lookupVariableById(varName)));
    }

    // Copy sprite information.
    this.currentCostume = target.currentCostume;
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
export class LogFrame {
  /**
   * When a new frame is created, information from the current state of the targets is saved. Some properties, like if the target is touching another target,
   * are calculated before being saved.
   *
   * @param {Context} context - The scratch virtual machine.
   * @param {string} block - The block that triggered the fame saving.
   */
  constructor(context, block) {
    /**
     * The timestamp of the frame.
     * TODO: investigate using currentMSecs instead.
     * @type {number}
     */
    this.time = context.timestamp();

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

    for (const target of context.vm.runtime.targets) {
      this.sprites.push(new LoggedSprite(target, context.vm.runtime.targets));
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
 * @property {number|null} [before]
 * @property {number|null} [after]
 * @property {string|null} [type]
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
  const before = constraints.before || last(frames).time;
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

// TODO: review
export class LogEvent {
  /**
   * 
   * @param {Context} context
   * @param type
   * @param data
   */
  constructor(context, type, data = {}) {
    this.time = context.timestamp();
    this.type = type;
    this.data = data;

    this.nextFrame = null;
    this.previousFrame = null;
  }

  getNextFrame() {
    return this.nextFrame;
  }

  getPreviousFrame() {
    return this.previousFrame;
  }
}

class Events {
  constructor() {
    this.list = [];
    this.length = 0;
    this.lastTime = 0;
  }

  push(event) {
    this.list.push(event);
    this.length++;
    this.lastTime = event.time;
  }

  filter(arg) {
    const type = arg.type || 'all';
    const before = arg.before || this.lastTime;
    const after = arg.after || 0;

    const filtered = [];
    for (const event of this.list) {
      if (type === 'all' || event.type === type) {
        if (event.time >= after && event.time <= before) {
          filtered.push(event);
        }
      }
    }
    return filtered;
  }
}

class Blocks {
  constructor() {
    this.blocks = {};
  }

  push(block) {
    if (!this.blocks[block]) {
      this.blocks[block] = 0;
    }
    this.blocks[block]++;
  }

  containsLoop() {
    return containsLoop(this.blocks);
  }

  containsBlock(blockName) {
    return containsBlock(blockName, this.blocks);
  }

  numberOfExecutions(blockName) {
    return countExecutions(blockName, this.blocks);
  }
}

// TODO: review
export class Log {

  constructor() {
    this.frames = [];
    this.events = new Events();
    this.renderer = new LogRenderer();
    this.blocks = new Blocks();
  }

  /**
   * Add a frame.
   * @param {Context} context
   * @param block
   */
  addFrame(context, block) {
    const frame = new LogFrame(context, block);
    this.frames.push(frame);
    this.blocks.push(block);
  }

  addEvent(event) {
    this.events.push(event);
  }

  reset() {
    // not needed
  }

  /** 
   * @return {LogFrame} return final state of sprites
   */
  get sprites() {
    return this.frames[this.frames.length - 1];
  }

  // Functions needed for evaluation

  // Sprite related
  getCostumes(spriteName, frames = this.frames) {
    const costumes = {};
    const costumeIds = new Set();
    for (const frame of frames) {
      const sprite = frame.getSprite(spriteName);
      if (sprite != null) {
        if (!costumeIds.has(sprite.currentCostume)) {
          costumeIds.add(sprite.currentCostume);
          costumes[sprite.currentCostume] = sprite.costume;
        }
      }
    }
    return costumes;
  }

  getNumberOfCostumes(spriteName) {
    const costumes = this.getCostumes(spriteName);
    return Object.keys(costumes).length;
  }

  getVariableValue(variableName, spriteName = 'Stage', frame = this.sprites) {
    for (const sprite of frame.sprites) {
      if (sprite.name === spriteName) {
        for (const variable of sprite.variables) {
          if (variable.name === variableName) {
            return variable.value;
          }
        }
      }
    }
  }

  getStartSprites() {
    return this.frames[0].sprites;
  }

  getMaxX(spriteName, frames = this.frames) {

    let max = -240;
    for (const frame of frames) {
      const sprite = frame.getSprite(spriteName);
      if (sprite != null) {
        if (sprite.x > max) {
          max = sprite.x;
        }
      }
    }
    return max;

  }

  getMinX(spriteName, frames = this.frames) {

    let min = 240;
    for (const frame of frames) {
      const sprite = frame.getSprite(spriteName);
      if (sprite != null) {
        if (sprite.x < min) {
          min = sprite.x;
        }
      }
    }
    return min;

  }

  getMaxY(spriteName, frames = this.frames) {

    let max = -180;
    for (const frame of frames) {
      const sprite = frame.getSprite(spriteName);
      if (sprite != null) {
        if (sprite.y > max) {
          max = sprite.y;
        }
      }
    }
    return max;

  }

  getMinY(spriteName, frames = this.frames) {

    let min = 180;
    for (const frame of frames) {
      const sprite = frame.getSprite(spriteName);
      if (sprite != null) {
        if (sprite.y < min) {
          min = sprite.y;
        }
      }
    }
    return min;

  }

  hasSpriteMoved(spriteName, frames = this.frames) {
    if (frames.length === 0) return false;
    const minX = this.getMinX(spriteName, frames);
    const maxX = this.getMaxX(spriteName, frames);
    const minY = this.getMinY(spriteName, frames);
    const maxY = this.getMaxY(spriteName, frames);
    return !(minX === maxX && minY === maxY);
  }

  inBounds(spriteName, frames = this.frames) {

    for (const frame of frames) {
      const sprite = frame.getSprite(spriteName);
      if (sprite != null) {
        if (sprite.isTouchingEdge) {
          return false;
        }
      }
    }
    return true;
  }

  getDirectionChanges(spriteName, frames = this.frames) {
    const directions = [];
    let oldDirection = 0;
    for (const frame of frames) {
      const sprite = frame.getSprite(spriteName);
      if (sprite != null) {
        if (oldDirection !== sprite.direction) {
          directions.push(sprite.direction);
          oldDirection = sprite.direction;
        }
      }
    }
    return directions;
  }

  getCostumeChanges(spriteName, frames = this.frames) {
    const costumes = [];
    let oldCostume = '';
    for (const frame of frames) {
      const sprite = frame.getSprite(spriteName);
      if (sprite != null) {
        if (oldCostume !== sprite.costume) {
          costumes.push(sprite.costume);
          oldCostume = sprite.costume;
        }
      }
    }
    return costumes;
  }

  isTouchingSprite(spriteName, targetName, frame) {
    return frame.isTouching(spriteName, targetName);
  }

  getDistancesToSprite(spriteName, targetName, frames = this.frames) {
    const distances = [];
    for (const frame of frames) {
      const sprite = frame.getSprite(spriteName);
      const target = frame.getSprite(targetName);
      if (sprite != null && target != null) {
        distances.push(Math.sqrt(distSq(sprite, target)));
      }
    }
    return distances;
  }

  doSpritesOverlap(spriteName1, spriteName2, frame = this.sprites) {
    const sprite1 = frame.getSprite(spriteName1);
    const sprite2 = frame.getSprite(spriteName2);
    const bounds1 = sprite1.bounds;
    const bounds2 = sprite2.bounds;
    // If one rectangle is on left side of other
    if (bounds1.left > bounds2.right || bounds1.right < bounds2.left) {
      return false;
    }
    // If one rectangle is above other
    if (bounds1.top < bounds2.bottom || bounds1.bottom > bounds2.top) {
      return false;
    }
    return true;

  }

  getSpriteLocations(spriteName, frames = this.frames) {
    const places = [];
    let lastX = 0;
    let lastY = 0;
    let first = true;
    for (const frame of frames) {
      const sprite = frame.getSprite(spriteName);
      if (lastX !== sprite.x || lastY !== sprite.y || first) {
        lastX = sprite.x;
        lastY = sprite.y;
        places.push({ x: lastX, y: lastY });
        first = false;
      }
    }
    return places;
  }

  // RENDERER RELATED

  getSquares() {
    return findSquares(this.renderer.lines);
  }

  getTriangles() {
    return findTriangles(this.renderer.lines);
  }

  getMergedLines() {
    return mergeLines(this.renderer.lines);
  }

  getLineLength(line) {
    return dist(line);
  }

  getResponses() {
    return this.renderer.responses;
  }

  getCreateSkinEvents() {
    const rendererEvents = this.events.filter({ type: 'renderer' });
    const createTextSkinEvents = [];
    for (const event of rendererEvents) {
      if (event.data.name === 'createTextSkin') {
        createTextSkinEvents.push(event);
      }
    }
    return createTextSkinEvents;
  }

  getDestroySkinEvents() {
    const rendererEvents = this.events.filter({ type: 'renderer' });
    const destroySkinEvents = [];
    for (const event of rendererEvents) {
      if (event.data.name === 'destroySkin') {
        destroySkinEvents.push(event);
      }
    }
    return destroySkinEvents;
  }

  getSkinDuration(text) {
    const createTextSkinEvents = this.getCreateSkinEvents();
    const destroyTextSkinEvents = this.getDestroySkinEvents();

    let time = 0;
    let id = -1;
    for (const e of createTextSkinEvents) {
      if (e.data.text === text) {
        time = e.time;
        id = e.data.id;
      }
    }
    for (const e of destroyTextSkinEvents) {
      if (e.data.id === id) {
        return (e.time - time);
      }
    }
    return null;
  }

}