import { LogEvent, LogFrame } from './log.js';
import { Action } from './scratchThreads.js';

class ScheduledAction {
  /**
   * Execute the action. This should do what the action is supposed to do,
   * but should not concern itself with scheduling details.
   *
   * This method should be "sync": the resolve callback must be called when
   * the event is done, async or not. The framework will take care of the
   * async/sync scheduling.
   *
   * @param {Context} _context - The context.
   * @param {function(T):void} _resolve - Mark the action as done.
   */
  execute(_context, _resolve) {
    throw new Error('You must implement and execution action.');
  }

  toString() {
    return this.constructor.name;
  }
}

class WaitEvent extends ScheduledAction {
  /**
   * @param {number} delay
   */
  constructor(delay) {
    super();
    this.delay = delay;
  }

  async execute(_context, resolve) {
    setTimeout(() => { resolve('wait resolved'); }, this.delay);
  }

  toString() {
    return `${super.toString()} for ${this.delay}`;
  }
}

class CallbackAction extends ScheduledAction {
  /**
   * @param {function} callback
   */
  constructor(callback) {
    super();
    this.callback = callback;
  }

  execute(context, resolve) {
    context.log.addFrame(context, 'manual_logging');
    this.callback();
    resolve();
  }
}

class InitialAction extends CallbackAction {
  constructor() {
    super(() => {});
  }
}

class EndAction extends ScheduledAction {
  execute(context, resolve) {
    for (const event of context.log.events.list) {
      if (event.nextFrame == null) {
        event.nextFrame = new LogFrame(context, 'programEnd');
      }
    }
    context.vm.stopAll();

    resolve();
    context.simulationEnd.resolve();
  }
}

class GreenFlagAction extends ScheduledAction {
  execute(context, resolve) {

    const event = new LogEvent(context, 'greenFlag');
    event.previousFrame = new LogFrame(context, 'greenFlag');
    context.log.addEvent(event);

    const list = context.vm.runtime.startHats('event_whenflagclicked');

    const topBlocks = [];
    for (const thread of list) {
      topBlocks.push(thread.topBlock);
    }

    const action = new Action(context, topBlocks);
    context.activeActions.push(action);
    action.actionEnded.promise.then(() => {
      console.log(`finished greenFlag()`);
      event.nextFrame = new LogFrame(context, 'greenFlagEnd');
      resolve('green flag resolved');
    });
  }
}

const STAGE = 'Stage';

class ClickSpriteAction extends ScheduledAction {
  /**
   * @param {string} spriteName
   */
  constructor(spriteName) {
    super();
    this.spriteName = spriteName;
  }

  execute(context, resolve) {
    // Get the sprite
    /** @type {Target} */
    let sprite;
    if (this.spriteName !== STAGE) {
      sprite = context.vm.runtime.getSpriteTargetByName(this.spriteName);
    } else {
      sprite = context.vm.runtime.getTargetForStage();
    }

    // Save the state of the sprite before the click event.
    const event = new LogEvent(context, 'click', { target: this.spriteName });
    event.previousFrame = new LogFrame(context, 'click');
    context.log.addEvent(event);

    // Simulate mouse click by explicitly triggering click event on the target
    let list;
    if (this.spriteName !== STAGE) {
      list = context.vm.runtime.startHats('event_whenthisspriteclicked', null, sprite);
    } else {
      list = context.vm.runtime.startHats('event_whenstageclicked', null, sprite);
    }

    const topBlocks = [];
    for (const thread of list) {
      topBlocks.push(thread.topBlock);
    }

    const action = new Action(context, topBlocks);
    context.activeActions.push(action);

    action.actionEnded.promise.then(() => {
      console.log(`finished click on ${this.spriteName}`);
      // save sprites state after click
      event.nextFrame = new LogFrame(context, 'clickEnd');
      resolve('sync resolve');
    });
  }

  toString() {
    return `${super.toString()} on ${this.sprite}`;
  }
}

// TODO: add support for other keys.
class PressKeyAction extends ScheduledAction {
  /**
   * @param {string} key
   */
  constructor(key) {
    super();
    this.key = key;
  }

  execute(context, resolve) {
    // Save sprites state before key press.
    const event = new LogEvent(context, 'key', { key: this.key });
    event.previousFrame = new LogFrame(context, 'key');
    context.log.addEvent(event);

    const scratchKey = context.vm.runtime.ioDevices.keyboard._keyStringToScratchKey(this.key);

    if (scratchKey === '') {
      throw new Error(`Unknown key press: '${this.key}'`);
    }

    const list = context.vm.runtime.startHats('event_whenkeypressed', {
      KEY_OPTION: scratchKey
    });

    const list2 = context.vm.runtime.startHats('event_whenkeypressed', {
      KEY_OPTION: 'any'
    });

    const topBlocks = [];
    for (const thread of list) {
      topBlocks.push(thread.topBlock);
    }
    for (const thread of list2) {
      topBlocks.push(thread.topBlock);
    }

    const action = new Action(context, topBlocks);
    context.activeActions.push(action);

    action.actionEnded.promise.then(() => {
      console.log(`finished keyPress on ${this.key}`);
      // save sprites state after click
      event.nextFrame = new LogFrame(context, 'keyEnd');
      resolve('sync resolve');
    });
  }
}

class MouseMoveAction extends ScheduledAction {
  constructor(data) {
    super();
    this.data = data;
  }
  
  execute(context, resolve) {
    this.data.x = this.data.x + 240;
    this.data.y = this.data.y + 180;
    this.data.canvasWidth = 480;
    this.data.canvasHeight = 360;
    context.vm.runtime.ioDevices.mouse.postData(this.data);
    resolve('Completed mouse movement');
  }
}

/**
 * The Scratch scheduler: allows scheduling events that
 * will be executed when running a scratch project.
 *
 * While we mostly speak about "the scheduler", it doesn't really exist.
 * The scheduler is a chain or tree of events, starting with the first event.
 * Each event is responsible for their own scheduling, and then running next
 * events, as described below.
 *
 * ### Scheduling
 *
 * Event scheduling results in a tree of events. Each events a list of
 * next events to be executed when the current event is done (see below).
 *
 * All events on the same level, i.e. in the same list of next events, will
 * be launched at the same time.
 *
 * All functions return the last added event to anchor new events. If you don't
 * want this, you'll need to save the previous event manually.
 *
 * See the examples for details.
 *
 * ### Types of events
 *
 * There are two types of events:
 *
 * - sync events, which will block next events until they are completed
 * - async events, which will yield to next events before completion
 *
 * For example, a "wait" event will be sync, since it is otherwise
 * pretty useless.
 *
 * A click event might be sync or async. If you want to wait until
 * everything triggered by the click is done, you should make it sync.
 * However, suppose you want to click a sprite, which will then move around
 * forever; if so, this will cause a timeout. You must make it async.
 *
 * ### Example
 *
 * Assume we start with event A, which has two events as next: B1 and B2.
 * B1 is synchronous, while B2 is not. B1 takes 2 time units to complete.
 * Additionally, B1 has one next event, C1. B2 has two, C2 & C3.
 *
 * Below is a reconstructed timeline, where the number represents the time
 * unit at which an event is started.
 *
 * ```
 * 1. A
 * 2. B1 - B2
 * 3.      C2 - C3
 * 4.
 * 5. C1
 * ```
 *
 * @example <caption>Schedule events sequentially</caption>
 * event.newEvent()
 *      .newEvent()
 *      .newEvent()
 *
 * @example <caption>Schedule events in parallel</caption>
 * event.newEvent();
 * event.newEvent();
 * event.newEvent();
 */
export default class ScheduledEvent {

  /**
   * Create a new event.
   *
   * You should not create events directly, but use one of the helper functions
   * instead.
   *
   * @param {ScheduledAction} action - The action to execute on this event.
   * @param {boolean} sync - The data for the event.
   * @param {number | null} timeout - How to long to wait before resolving.
   *
   * @private
   */
  constructor(action, sync = true, timeout = null) {
    /** @private */
    this.action = action;
    /** @private */
    this.sync = sync;
    /** @private */
    this.timeout = timeout;
    /**
     * @private
     * @type {ScheduledEvent[]}
     */
    this.nextEvents = [];
  }

  /**
   * Create the initial event.
   *
   * @return {ScheduledEvent}
   * @protected
   */
  static create() {
    return new ScheduledEvent(new InitialAction());
  }

  /**
   * @return {string} A name identifying this event, for debugging and logging
   *                  purposes.
   */
  toString() {
    return this.action.toString();
  }

  /**
   * Execute this event, and launch the next events when allowed.
   *
   * If the current event is synchronous, the action is executed, after which
   * the next events are launched. If the event is asynchronous, the action is
   * executed, but the next events are launched immediately.
   * 
   * You should not call this function; the framework takes care of it for you.
   *
   * @param  {Context} context
   * @return {Promise<void>}
   * @package
   */
  run(context) {
    const action = new Promise((resolve, _reject) => {
      this.action.execute(context, resolve);
      // Schedule next events if we don't wait.
      if (!this.sync) {
        this.nextEvents.forEach(e => e.run(context));
      }
    });
    const time = this.timeout || context.actionTimeout;
    const timeout = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error(`timeout after ${time}`));
      }, time);
    });

    // This will take the result from the first promise to resolve, which
    // will be either the result or the timeout if something went wrong.
    // Note that async events cannot timeout.
    return Promise.race([action, timeout]).then(() => {
      // If we had to wait, schedule the events now.
      if (this.sync) {
        this.nextEvents.forEach(e => e.run(context));
      }
    }, (reason) => {
      console.error(reason);
      context.vm.stopAll();
      context.output.addError('Time limit exceeded?');
      context.output.addError(reason.toString());
    });
  }

  /**
   * Create and schedule a new event.
   *
   * @param {ScheduledAction} action
   * @param {boolean} sync
   * @param {number|null} timeout
   * @return {ScheduledEvent}
   * @private
   */
  constructNext(action, sync = true, timeout = null) {
    const event = new this.constructor(action, sync, timeout);
    this.nextEvents.push(event);
    return event;
  }

  /**
   * Wait delay amount of ms before proceeding with the next event.
   * This event is always synchronous.
   *
   * @param {number} delay - How long we should wait in ms.
   * @return {ScheduledEvent}
   */
  wait(delay) {
    return this.constructNext(new WaitEvent(delay), true, delay + 10);
  }

  /**
   * Schedule an event for each item in a list.
   *
   * This function is basically a wrapper around `reduce`. For each item in the list,
   * the reducer is called with the result of the previous call and the current value,
   * and should return the new value for the next call.
   *
   * What this means is that the reducer should return the new anchor event. If you
   * return a new event each time, the events will be scheduled in sequence. If you
   * return the same event every time, they will be scheduled in parallel.
   *
   * The reducer accepts all params from the normal `reduce`'s reducer.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
   *
   * It basically means you get the accumulator, the value, (optionally) the value's index and (optionally)
   * the full array of items.
   *
   * @example <caption>Scheduling in sequence</caption>
   * event.forEach([100, 200, 300], (previous, value) => {
   *   return previous.wait(value);
   * })
   * // Schedules events that wait the amount in the array.
   *
   * @example <caption>Scheduling in parallel</caption>
   * event.forEach([100, 200, 300], (_previous, value) => {
   *   return event.wait(value);
   * })
   * // Schedules events that wait the amount in the array.
   *
   * By default, the last event will become the new anchor.
   *
   * @param {any[]} items - The items to create events for.
   * @param {function(ScheduledEvent, any, number, any[]):ScheduledEvent} reducer - Reduces the events.
   * @return {ScheduledEvent}
   */
  forEach(items, reducer) {
    return items.reduce(reducer, this);
  }

  /**
   * End the events and shut down the Scratch VM. After you are done
   * with your events, you should call this, or the VM risks to never
   * stop.
   *
   * Do ensure you either wait long enough, or anchor on a sync event,
   * or the VM will be stopped before all events have completed.
   *
   * This is a sync event: the event will resolve after the VM has
   * shut down.
   *
   * @return {ScheduledEvent}
   */
  end() {
    return this.constructNext(new EndAction());
  }

  /**
   * Save the current frame in the log, optionally doing something.
   *
   * The current frame will be saved, after which the callback is
   * called with the log (already containing the new frame).
   *
   * For example, you can add a test or a debug statement in the
   * callback.
   *
   * @param {function} callback
   * @return {ScheduledEvent}
   */
  log(callback = () => {}) {
    return this.constructNext(new CallbackAction(callback));
  }

  /**
   * Click the "green flag". This is often the first thing you do.
   *
   * This event can be synchronous or not. If synchronous, all blocks
   * attached to the green flag hat will need to be completed before the
   * event resolves. Otherwise it resolves immediately.
   *
   * @param {boolean} sync - Synchronous or not, default true.
   * @param {number|null} timeout - How long to wait for synchronous events.
   * @return {ScheduledEvent}
   */
  greenFlag(sync = true, timeout = null) {
    return this.constructNext(new GreenFlagAction(), sync, timeout);
  }

  /**
   * Click the sprite with the given name.
   *
   * This event can be asynchronous. If synchronous, all blocks attached
   * to hats listening to the click event must be completed before the
   * event resolves. Otherwise it resolves immediately.
   *
   * @param {string} spriteName - The name of the sprite.
   * @param {boolean} sync - Synchronous or not, default true.
   * @param {number|null} timeout - How long to wait for synchronous events.
   * @return {ScheduledEvent}
   */
  clickSprite(spriteName = STAGE, sync = true, timeout = null) {
    return this.constructNext(new ClickSpriteAction(spriteName), sync, timeout);
  }

  /**
   * Press a key.
   *
   * This event can be asynchronous. If synchronous, all blocks attached
   * to hats listening to the click event must be completed before the
   * event resolves. Otherwise it resolves immediately.
   *
   * TODO: this only works with hats at this time.
   *
   * @param {string} key - The name of the key to press.
   * @param {boolean} sync - Synchronous or not, default true.
   * @param {number|null} timeout - How long to wait for synchronous events.
   * @return {ScheduledEvent}
   */
  pressKey(key, sync = true, timeout = null) {
    return this.constructNext(new PressKeyAction(key), sync, timeout);
  }

  /**
   * Move the mouse.
   * 
   * At the moment you can pass all data to the mouse event, and thus
   * also simulate clicks. This is not supported and will probably break
   * in weird ways.
   * 
   * This event is synchronous: the event resolves after the mouse data
   * has been posted to the Scratch VM.
   * 
   * @param {Object} data
   * @return {ScheduledEvent}
   */
  moveMouse(data) {
    return this.constructNext(new MouseMoveAction(data), true, null);
  }
}
