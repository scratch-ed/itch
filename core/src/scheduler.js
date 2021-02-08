import { LogEvent, LogFrame } from './log.js';
import { ThreadListener } from './listener.js';

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
    context.simulationEnd.resolve('done with simulation');
  }
}

class GreenFlagAction extends ScheduledAction {
  execute(context, resolve) {

    const event = new LogEvent(context, 'greenFlag');
    event.previousFrame = new LogFrame(context, 'greenFlag');
    context.log.addEvent(event);

    const list = context.vm.runtime.startHats('event_whenflagclicked');

    const action = new ThreadListener(context, list);
    context.threadListeners.push(action);
    action.promise.then(() => {
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

    const action = new ThreadListener(context, list);
    context.threadListeners.push(action);

    action.promise.then(() => {
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

class WhenPressKeyAction extends ScheduledAction {
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

    const threads = list.concat(list2);
    const action = new ThreadListener(context, threads);
    context.threadListeners.push(action);

    action.promise.then(() => {
      console.log(`finished keyPress on ${this.key}`);
      // save sprites state after click
      event.nextFrame = new LogFrame(context, 'keyEnd');
      resolve('sync resolve');
    });
  }
}

class MouseUseAction extends ScheduledAction {
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

class KeyUseAction extends ScheduledAction {
  /**
   * @param {string} key
   * @param {boolean|number} down
   * @param {number} delay
   */
  constructor(key, down, delay) {
    super();
    this.key = key;
    this.down = down;
    this.delay = delay;
  }

  execute(context, resolve) {
    console.log(`Press ${this.key}: ${this.isDown()}`);
    context.vm.postIOData('keyboard', {
      key: this.key,
      isDown: this.isDown(),
    });

    if (this.isDelayed()) {
      setTimeout(() => {
        console.log(`Release ${this.key}: false`);
        context.vm.postIOData('keyboard', {
          key: this.key,
          isDown: false,
        });
        setTimeout(() => {
          resolve('Completed delayed key movement');
        }, this.delay);
      }, this.down);
    } else {
      setTimeout(() => {
        resolve('Completed key movement');
      }, this.delay);
    }
  }

  isDown() {
    if (this.isDelayed()) {
      return true;
    } else {
      return this.down;
    }
  }

  isDelayed() {
    return typeof this.down === 'number';
  }
}

class SendBroadcastAction extends ScheduledAction {
  /**
   * @param {string} name - The name of the broadcast
   */
  constructor(name) {
    super();
    this.name = name;
  }

  execute(context, resolve) {
    // Save the state of the sprite before the click event.
    /** @type {Target} */
    const target = context.vm.runtime.getTargetForStage();
    const event = new LogEvent(context, 'broadcast', { target: target.getName() });
    event.previousFrame = new LogFrame(context, 'broadcast');
    context.log.addEvent(event);

    const threads = context.vm.runtime.startHats('event_whenbroadcastreceived', {
      BROADCAST_OPTION: this.name,
    });

    const action = new ThreadListener(context, threads);
    context.threadListeners.push(action);

    action.promise.then(() => {
      console.log(`finished broadcast of ${this.name}`);
      // save sprites state after click
      event.nextFrame = new LogFrame(context, 'broadcastEnd');
      resolve('resolve');
    });
  }

  toString() {
    return `${super.toString()} of ${this.name}`;
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
   * Send a broadcast of the specified signal.
   * 
   * This event can be asynchronous. If synchronous, all blocks attached
   * to hats listening to the given broadcast must be completed before
   * the event resolves. Otherwise it resolves immeditaley.
   * 
   * If synchronous, resembles a "Broadcast () and Wait" block, otherwise
   * resembles a "Broadcast ()" block.
   * 
   * @see https://en.scratch-wiki.info/wiki/Broadcast_()_(block)
   * @see https://en.scratch-wiki.info/wiki/Broadcast_()_and_Wait_(block)
   * 
   * @param {string} broadcast - The name of the broadcast to send.
   * @param {boolean} sync - Synchronous or not, default true.
   * @param {number|null} timeout - How long to wait for synchronous events.
   * @return {ScheduledEvent}
   */
  sendBroadcast(broadcast, sync = true, timeout = null) {
    return this.constructNext(new SendBroadcastAction(broadcast), sync, timeout);
  }

  /**
   * Simulate a key press.
   *
   * The difference between this event and the `useKey` event is similar
   * to the difference between the "When () Key Pressed" block and the
   * "Key () Pressed?" block.
   *
   * This event will activate all hats with the "When () Key Pressed"
   * block. This means it simulates a full "key press", meaning pressing
   * it down and letting go. It has no impact on the current key status,
   * and will NOT trigger a `KEY_PRESSED` event.
   *
   * This event can be asynchronous. If synchronous, all blocks attached
   * to hats listening to the click event must be completed before the
   * event resolves. Otherwise it resolves immediately.
   *
   * @see https://en.scratch-wiki.info/wiki/Key_()_Pressed%3F_(block)
   * @see https://en.scratch-wiki.info/wiki/When_()_Key_Pressed_(Events_block)
   *
   * @param {string} key - The name of the key to press.
   * @param {boolean} sync - Synchronous or not, default true.
   * @param {number|null} timeout - How long to wait for synchronous events.
   * @return {ScheduledEvent}
   */
  pressKey(key, sync = true, timeout = null) {
    return this.constructNext(new WhenPressKeyAction(key), sync, timeout);
  }

  /**
   * Use the keyboard.
   *
   * The difference between this event and the `pressKey` event is similar
   * to the difference between the "When () Key Pressed" block and the
   * "Key () Pressed?" block.
   *
   * This event will update the internal state of the keyboard. When you
   * send this event, the key will be pressed down, and kept that way.
   * As such, this key will trigger both "When () Key Pressed" blocks
   * and return true for "Key () Pressed?" blocks.
   *
   * To make life easier, you can optionally pass a time, after which the
   * key is lifted automatically.
   *
   * If no timeout is passed, the event is asynchronous. If a timeout is
   * passed, the event resolves after the key has been lifted if synchronous.
   *
   * Due to the nature of the event, it is currently not possible to wait
   * on completion of scripts with this event. This would mean basically
   * running scripts to see if they are waiting on this press or not, which
   * is not possible.
   *
   * Finally, since the event should at least be noticeable in the next step
   * of the Scratch VM, by default a 10 ms waiting time is introduced after
   * each key event (the delay). You can modify this delay by setting the last
   * parameter. In most cases, it is not necessary to adjust this.
   *
   * The time the key is pressed before it is released does not account for
   * the delay: if  `down` is 50ms, the key will be lifted after 50 ms.
   *
   * When using as a sync event, the total execution time will therefore be
   * delay + down. If down is true or false, the execution time will be just
   * the delay.
   *
   * The `useMouse` event is similar, but for the mouse.
   *
   * @see https://en.scratch-wiki.info/wiki/Key_()_Pressed%3F_(block)
   * @see https://en.scratch-wiki.info/wiki/When_()_Key_Pressed_(Events_block)
   *
   * @param {string} key - The key to press.
   * @param {number|boolean} down - If a boolean, the key event will be
   *        passed as is. If a number, the key will first be set to down,
   *        but then lifted after the given amount of ms. By default, this
   *        is 10 ms.
   * @param {boolean} sync - If the lifting of the key press should be async
   *        or sync. When no automatic lifting is used, the event is always
   *        async.
   * @param {number} delay - The amount of time to wait after the last key
   *        press. You can set this to less than 10, but you risk that your
   *        key press will be undetected.
   *
   * @return {ScheduledEvent}
   */
  useKey(key, down = 10, sync = true, delay = 10) {
    return this.constructNext(new KeyUseAction(key, down, delay), sync);
  }

  /**
   * Use the mouse.
   *
   * At the moment you can pass all data to the mouse event, and thus
   * also simulate clicks. This is not supported and will probably break
   * in weird ways.
   *
   * This event is synchronous: the event resolves after the mouse data
   * has been posted to the Scratch VM.
   *
   * This updates the mouse data in the VM, and keeps it like that. E.g.
   * if you move the mouse to x+5, y-5, it will stay there.
   *
   * @param {Object} data
   * @return {ScheduledEvent}
   */
  useMouse(data) {
    return this.constructNext(new MouseUseAction(data));
  }
}
