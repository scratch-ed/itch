import { ScheduledAction } from './action.js';
import { LogEvent, LogFrame } from '../log.js';
import { BroadcastListener } from '../listener.js';

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
   * @param {number|null} x
   * @param {number|null} y
   */
  constructor(name, x, y) {
    super();
    this.name = name;
    this.x = x;
    this.y = y;
  }

  execute(context, resolve) {
    const sprite = context.vm.runtime.getSpriteTargetByName(this.name);
    if (!sprite) {
      throw new Error(`Sprite ${this.name} was not found in the runtime.`);
    }
    const callback = (target) => {
      if ((this.x === null || numericEquals(target.x, this.x)) && (this.y === null || numericEquals(target.y, this.y))) {
        sprite.removeListener('TARGET_MOVED', callback);
        resolve(`finished ${this}`);
      }
    };
    sprite.addListener('TARGET_MOVED', callback);
  }

  toString() {
    return `Wait for sprite ${this.name} to reach ${this.x}, ${this.y}`;
  }
}

class WaitForSpriteTouchAction extends ScheduledAction {
  /**
   * @param {string} name
   * @param {string} target
   */
  constructor(name, target) {
    super();
    this.name = name;
    this.target = target;
  }

  execute(context, resolve) {
    const sprite = context.vm.runtime.getSpriteTargetByName(this.name);
    if (!sprite) {
      throw new Error(`Sprite ${this.name} was not found in the runtime.`);
    }
    const callback = (target) => {
      if (target.isTouchingObject(this.target)) {
        sprite.removeListener('TARGET_MOVED', callback);
        resolve(`finished ${this}`);
      }
    };
    sprite.addListener('TARGET_MOVED', callback);
  }

  toString() {
    return `Wait for sprite ${this.name} to touch ${this.target}`;
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
   * @return {WaitCondition}
   */
  toMove(timeout = null) {
    return {
      action: new WaitForSpriteAction(this.name),
      timeout: timeout
    };
  }

  /**
   * Wait for a sprite to reach a certain position.
   *
   * @param {number|null} x - Null if irrelevant
   * @param {number|null} y - Null if irrelevant
   * @param {number|null} timeout - Optional timeout.
   *
   * @return {WaitCondition}
   */
  toReach(x, y, timeout = null) {
    if (x === null && y === null) {
      console.warn("Both positions in wait condition are wildcard. A mistake?");
    }
    return {
      action: new WaitForSpritePositionAction(this.name, x, y),
      timeout: timeout
    };
  }

  /**
   * Wait for a sprite to touch another sprite.
   *
   * @param {string} target - Name of the sprite.
   * @param {number|null} timeout - Optional timeout.
   *
   * @return {WaitCondition}
   */
  toTouch(target, timeout = null) {
    return {
      action: new WaitForSpriteTouchAction(this.name, target),
      timeout: timeout
    };
  }

  /**
   * Wait for a sprite to touch the edge of the stage.
   *
   * @param {number|null} timeout - Optional timeout.
   *
   * @return {WaitCondition}
   */
  toTouchEdge(timeout = null) {
    return this.toTouch('_egde_', timeout);
  }

  /**
   * Wait for a sprite to touch the current mouse position.
   *
   * If you want to move the mouse while waiting on it, you should
   * fork the event stream.
   *
   * @param {number|null} timeout - Optional timeout.
   *
   * @return {WaitCondition}
   */
  toTouchMouse(timeout = null) {
    return this.toTouch('_mouse_', timeout);
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
