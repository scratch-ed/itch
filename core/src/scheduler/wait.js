import castArray from 'lodash/castArray';
import { ScheduledAction } from './action.js';
import { LogEvent, LogFrame } from '../log.js';
import { BroadcastListener } from '../listener.js';
import { castCallback } from '../utils.js';

class WaitEvent extends ScheduledAction {
  /**
   * @param {number} delay
   */
  constructor(delay) {
    super();
    this.delay = delay;
  }

  execute(context, resolve) {
    const delay = context.accelerateEvent(this.delay);
    setTimeout(() => { resolve(`finished ${this}`); }, delay);
  }

  toString() {
    return `${super.toString()} for ${this.delay}`;
  }
}

class WaitForSpriteAction extends ScheduledAction {
  /**
   * @param {string} name
   */
  constructor(name) {
    super();
    this.name = name;
    this.active = true;
  }

  execute(context, resolve) {
    const sprite = context.vm.runtime.getSpriteTargetByName(this.name);
    if (!sprite) {
      throw new Error(`Sprite ${this.name} was not found in the runtime.`);
    }
    const callback = (target, oldX, oldY) => {
      if (target.x !== oldX || target.y !== oldY) {
        sprite.removeListener('TARGET_MOVED', callback);
        resolve(`finished ${this}`);
      }
    };
    sprite.addListener('TARGET_MOVED', callback);
  }

  toString() {
    return `Wait for sprite ${this.name} to move.`;
  }
}

class WaitForSpritePositionAction extends ScheduledAction {
  /**
   * @param {string} name
   * @param {function(x:number,y:number):boolean} callback
   */
  constructor(name, callback) {
    super();
    this.name = name;
    this.callback = callback;
  }

  execute(context, resolve) {
    const sprite = context.vm.runtime.getSpriteTargetByName(this.name);
    if (!sprite) {
      throw new Error(`Sprite ${this.name} was not found in the runtime.`);
    }
    const event = new LogEvent(context, 'waitForSpritePosition')
    event.previousFrame = new LogFrame(context, 'event');
    context.log.addEvent(event);
    const callback = (target) => {
      if (this.callback(target.x, target.y)) {
        sprite.removeListener('TARGET_MOVED', callback);
        event.nextFrame = new LogFrame(context, 'event');
        resolve(`finished ${this}`);
      }
    };
    sprite.addListener('TARGET_MOVED', callback);
  }

  toString() {
    return `Wait for sprite ${this.name} to reach one of ${this.positions}`;
  }
}

class WaitForSpriteTouchAction extends ScheduledAction {
  /**
   * @param {string} name
   * @param {function():string[]|string} paramCallback
   */
  constructor(name, paramCallback) {
    super();
    this.name = name;
    this.paramCallback = paramCallback;
  }

  execute(context, resolve) {
    const sprite = context.vm.runtime.getSpriteTargetByName(this.name);
    if (!sprite) {
      throw new Error(`Sprite ${this.name} was not found in the runtime.`);
    }
    this.targets = castArray(this.paramCallback());
    const event = new LogEvent(context, 'waitForSpriteTouch', {
      targets: this.targets,
      sprite: this.name
    });
    event.previousFrame = new LogFrame(context, 'event');
    context.log.addEvent(event);
    const callback = (target) => {
      for (const goal of this.targets) {
        console.log("Checking...", goal);
        if (target.isTouchingObject(goal)) {
          sprite.removeListener('TARGET_MOVED', callback);
          event.nextFrame = new LogFrame(context, 'event');
          resolve(`finished ${this}`);
          return;
        }
      }
    };
    sprite.addListener('TARGET_MOVED', callback);
  }

  toString() {
    return `Wait for sprite ${this.name} to touch one of ${this.paramCallback()}`;
  }
}

class WaitForSpriteNotTouchAction extends ScheduledAction {
  /**
   * @param {string} name
   * @param {function():string} paramCallback
   */
  constructor(name, paramCallback) {
    super();
    this.name = name;
    this.paramCallback = paramCallback;
  }

  execute(context, resolve) {
    const sprite = context.vm.runtime.getSpriteTargetByName(this.name);
    if (!sprite) {
      throw new Error(`Sprite ${this.name} was not found in the runtime.`);
    }
    this.target = this.paramCallback();
    const event = new LogEvent(context, 'waitForSpriteNotTouch', {
      target: this.target,
      sprite: this.name
    });
    event.previousFrame = new LogFrame(context, 'event');
    context.log.addEvent(event);
    const callback = (target) => {
      if (!target.isTouchingObject(this.target)) {
        sprite.removeListener('TARGET_MOVED', callback);
        event.nextFrame = new LogFrame(context, 'event');
        resolve(`finished ${this}`);
      }
    };
    sprite.addListener('TARGET_MOVED', callback);
  }

  toString() {
    return `Wait for sprite ${this.name} to not touch ${this.target}`;
  }
}

class WaitOnBroadcastAction extends ScheduledAction {
  /**
   * @param {string} name - Name of the broadcast.
   */
  constructor(name) {
    super();
    this.name = name;
  }

  execute(context, resolve) {
    const event = new LogEvent(context, 'broadcast_listener', { name: this.name });
    event.previousFrame = new LogFrame(context, 'broadcast_listener');
    context.log.addEvent(event);

    const listener = new BroadcastListener(this.name);
    context.broadcastListeners.push(listener);
    listener.promise.then(() => {
      event.nextFrame = new LogFrame(context, 'broadcastReceived');
      resolve(`finished ${this}`);
    });
  }
}

/**
 * Various conditions for sprites.
 */
export class SpriteCondition {
  constructor(name) {
    this.name = name;
  }

  /**
   * Wait for a sprite to move.
   *
   * @param {number|null} timeout - Optional timeout.
   * @param {string|null} message
   * @return {WaitCondition}
   */
  toMove(timeout = null, message = null) {
    return {
      action: new WaitForSpriteAction(this.name),
      timeout: timeout,
      message: message
    };
  }

  /**
   * Wait for a sprite to reach a certain position.
   * 
   * You can pass one position or a list of positions. If a list, the sprite
   * needs to reach one of the locations. For each location, you can leave either x or y
   * as null, which will be interpreted as a wildcard. A position object with both x and y
   * as null is considered an error.
   * 
   * Alternatively, you can pass a callback that will receive the position (x,y) of the sprite.
   * It must return true if the position is considered reached.
   * 
   * The callback can be used to test things like "is the sprite.x > 170?".
   * 
   * This event is logged with event type `waitForSpritePosition`. The previous frame
   * is taken at the start of the wait. The next frame is taken when the condition has been
   * completed.
   * 
   * {Array<{x:number|null,y:number|null}>|{x:number|null,y:number|null}|function(x:number,y:number):boolean}
   *
   * @param {any} positions - The positions.
   * @param {number|null} timeout - Optional timeout.
   * @param {string|null} message - Optional message
   *
   * @return {WaitCondition}
   */
  toReach(positions, timeout = null, message = null) {
    let callback;
    if (typeof positions !== 'function') {
      callback = (x, y) => {
        return castArray(positions).some(pos => {
          if (pos.x === null && pos.y === null) {
            console.warn("Both positions in wait condition are wildcard. A mistake?");
          }
          return (pos.x === null || numericEquals(x, pos.x)) && (pos.y === null || numericEquals(y, pos.y));
        });
      }
    } else {
      callback = positions;
    }
    return {
      action: new WaitForSpritePositionAction(this.name, callback),
      timeout: timeout,
      message: message
    };
  }

  /**
   * Wait for a sprite to touch another sprite.
   * 
   * This event is logged with event type `waitForSpriteTouch`. The previous frame
   * is taken at the start of the wait. The next frame is taken when the condition has been
   * completed.
   *
   * @param {string|string[]|function():string[]|string} targets - Name of the sprite.
   * @param {number|null} timeout - Optional timeout.
   * @param {string|null} message - Optional message
   *
   * @return {WaitCondition}
   */
  toTouch(targets, timeout = null, message = null) {
    const callback = castCallback(targets);
    return {
      action: new WaitForSpriteTouchAction(this.name, callback),
      timeout: timeout,
      message: message
    };
  }

  /**
   * Wait for a sprite to not touch another sprite.
   * 
   * @param {string|function():string} target
   * @param {?number} timeout
   * @param {string|null} message - Optional message
   * @return {WaitCondition}
   */
  toNotTouch(target, timeout = null, message = null) {
    const callback = castCallback(target);
    return {
      action: new WaitForSpriteNotTouchAction(this.name, callback),
      timeout: timeout,
      message: message
    }
  }

  /**
   * Wait for a sprite to touch the edge of the stage.
   *
   * @param {number|null} timeout - Optional timeout.
   * @param {string|null} message - Optional message
   *
   * @return {WaitCondition}
   */
  toTouchEdge(timeout = null, message = null) {
    return this.toTouch('_edge_', timeout, message);
  }

  /**
   * Wait for a sprite to touch the current mouse position.
   *
   * If you want to move the mouse while waiting on it, you should
   * fork the event stream.
   *
   * @param {number|null} timeout - Optional timeout.
   * @param {string|null} message - Optional message
   *
   * @return {WaitCondition}
   */
  toTouchMouse(timeout = null, message = null) {
    return this.toTouch('_mouse_', timeout, message);
  }
}

/**
 * Start a condition for a specific sprite.
 *
 * @alias wait:sprite
 * @param {string} name - Name of the sprite.
 *
 * @return SpriteCondition
 */
export function sprite(name) {
  return new SpriteCondition(name);
}

/**
 * Wait for a broadcast to be sent before proceeding.
 *
 * As with all wait events, this event is always synchronous.
 *
 * The event is logged with event type `broadcast_listener`.
 *
 * @alias wait:broadcast
 * @param {string} name - Name of the broadcast to wait on.
 * @param {number|null} timeout - Max time to wait before aborting.
 *
 * @return {WaitCondition}
 */
export function broadcast(name, timeout = null) {
  return {
    action: new WaitOnBroadcastAction(name),
    timeout: timeout
  };
}

/**
 * Wait delay amount of ms before proceeding with the next event.
 * This event is always synchronous.
 *
 * @alias wait:delay
 * @param {number} delay - How long we should wait in ms.
 * @return {WaitCondition}
 */
export function delay(delay) {
  return {
    action: new WaitEvent(delay),
    timeout: delay + 10
  };
}
