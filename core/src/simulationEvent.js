/* Copyright (C) 2019 Ghent University - All Rights Reserved */
import { Log, LogEvent, LogFrame } from './log';
import { Action } from './scratchThreads';

// TODO: can the action system be based on Promises instead?

/**
 * @template T
 * @callback EventAction
 * @param {T} resolve - Make the action successful.
 * @param {*} reject - Make the action fail.$
 * @return {void} Nothing.
 */

/**
 * Create an action that will resolve to the given data
 * after the given delay.
 *
 * @template D
 * @param {D} data
 * @param {number} delay
 *
 * @return {EventAction<D>}
 */
function delayedAction(data, delay) {
  return ((resolve, _reject) => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
}

/**
 * Promise based scheduler for Scratch events.
 */
export default class SimulationEvent {
  /**
   * Begin a new schedule.
   *
   * @param {Context} context - The context.
   * @param {EventAction<*>} action - The first action to execute.
   * @param delay
   */
  constructor(context, action, delay, debugName = "initial") {
    this.context = context;
    this.debugName = debugName;

    // action that needs to be executed
    this.action = action || delayedAction('Start event resolved', delay);

    /**
     * The next event to be executed.
     *
     * Due to the chaining method, this will often only contain
     * one event. When it contains multiple events, they will
     * be executed concurrently.
     *
     * @type {SimulationEvent[]}
     */
    this.nextEvents = [];
  }

  async launch() {
    const executeAction = new Promise((resolve, reject) => {
      console.log(`Doing action of ${this.debugName}`);
      this.action(resolve, reject);
    });

    const vm = this.context.vm;
    return executeAction.then(() => {
      for (const event of this.nextEvents) {
        event.launch();
      }
    }, (reason) => {
      console.log(reason);
      console.log('Test ended: time limit exceeded');
      vm.stopAll();
      this.context.output.addError('Time limit exceeded!');
    });
  }

  /**
   * Schedule the next event.
   *
   * @param {SimulationEvent} event - The event to schedule.
   * @return {SimulationEvent} The next event, for scheduling.
   */
  nextEvent(event) {
    // add next event to the list of events
    this.nextEvents.push(event);

    // return the next event (for chaining purposes)
    return event;
  }

  /**
   * Schedule the next event based on the action and delay.
   * 
   * This will schedule an event after the current one, with the optional
   * delay. The tree is not forked.
   * 
   * @param {EventAction} action
   * @param {number} delay
   * @return {SimulationEvent}
   */
  next(action, delay = 0, debugName = "") {
    return this.nextEvent(new this.constructor(this.context, action, delay, debugName));
  }

  // start() {
  //   return this.next((resolve, reject) => {
  //     // Give sprites 500 ms to load
  //     setTimeout(() => {
  //       resolve();
  //     }, 300);
  //   });
  // }

  /**
   * Generate multiple event generators; the first event generator will be
   * anchored to the current event; each event generator can return an event
   * that will serve as an anchor for the next event generator.
   * 
   * @param eventGenerators
   * @return {SimulationEvent}
   * 
   * @private
   */
  fork(eventGenerators) {

    let anchor = this;
    let nextAnchor;

    // call each of the eventGenerators on the current event
    for (const eventGenerator of eventGenerators) {

      // call event generator on the current event
      // NOTE: the current event is bound to this in the event generator,
      //       but it is also passed as the first argument so that fat
      //       arrow functions can also get access to the current event
      nextAnchor = eventGenerator.call(anchor, anchor);

      // new anchor is event returned by event generator (if any)
      // NOTE: sequential behaviour only if event generator returns a
      //       value that is itself an event, that will serve as the
      //       anchor point for the next generation of events
      if (nextAnchor instanceof SimulationEvent) {
        anchor = nextAnchor;
      }

    }

    // return anchor returned by the last event generator launched (or the
    // current event in case the event generators do not return events)
    return anchor;
  }

  // generate a tree of events for each item given; the event generator is a
  // function whose "this" is bound to the anchor event
  // sequential execution of event (tree) after the current event
  // NOTE: the event is itself responsible for returning the event that will
  //       be the anchor for the next event in the sequence; if the value
  //       returned is undefined, the current event serves as the anchor, so
  //       that we will have parallel execution of the events (as in the
  //       previous method)
  /**
   * Generate a tree of events for each item.
   * 
   * For each item, the generate is called.
   * 
   * @param items
   * @param eventGenerator
   * @return {SimulationEvent}
   */
  foreach(items, eventGenerator) {

    let anchor = this;
    let nextAnchor;

    // for each item, launch the event (tree) after the current event
    for (const index in items) {

      // call event generator on the current event
      // NOTE: the current event is bound to this in the event generator,
      //       but it is also passed as the first argument so that fat
      //       arrow functions can also get access to the current event
      nextAnchor = eventGenerator.call(anchor, index, items[index], anchor);

      // new anchor is event returned by event generator (if any)
      // NOTE: sequential behaviour only if event generator returns a
      //       value that is itself an event, that will serve as the
      //       anchor point for the next generation of events
      if (nextAnchor instanceof SimulationEvent) {
        anchor = nextAnchor;
      }

    }

    // return anchor of the last event generator launched (or the current
    // event in case the event generators do not return events)
    return anchor;

  }

  range(start, stop, step, eventGenerator) {

    let anchor = this;        // start from event on which method is called
    let index = 0;            // keep track of number of repetitions
    let next = start;         // next event should be generated at start time

    while (next < stop) {

      // call event generator on the current event
      const nextAnchor = eventGenerator.call(anchor, index, anchor);

      // new anchor is event returned by event generator (if any)
      // NOTE: sequential behaviour only if event generator returns a
      //       value that is itself an event, that will serve as the
      //       anchor point for the next generation of events
      if (nextAnchor instanceof SimulationEvent) {
        anchor = nextAnchor;
      }

      // launch next event
      index += 1;
      next += step;

    }

    return anchor;

  }

  clearLog() {

    log.reset();
    return this.next((resolve, reject) => {
      resolve();
    });

  }

  // utility functions for predefined actions

  /**
   * Wait delay amount of ms before proceeding with the next event.
   *
   * @param {number} delay
   * @return {SimulationEvent} The scheduler.
   */
  wait(delay) {
    return this.next((resolve, _reject) => {

      console.log(`waiting for ${delay}`);

      setTimeout(() => {
        resolve('wait resolved');
      }, delay);
    }, 0, "WAIT");

  }

  clickSprite(data = {}) {

    return this.next((resolve, reject) => {

      const spriteName = data.spriteName || 'Stage';
      const delay = data.delay || 0;
      const timeout = data.timeout || this.context.actionTimeout;
      let sync = data.sync;
      if (sync === undefined) sync = true;

      const startTime = Date.now();
      console.log(`${this.context.timestamp()}: click ${spriteName}`);

      this.context.output.startTestCase(`Klik op sprite: ${spriteName}`);

      // fetch the target
      const _sprite = this.context.vm.runtime.getSpriteTargetByName(spriteName);

      // save sprites state before click
      const event = new LogEvent(this.context, 'click', { target: spriteName });
      event.previousFrame = new LogFrame(this.context, 'click');
      this.context.log.addEvent(event);

      // simulate mouse click by explicitly triggering click event on
      // the target
      let list;
      if (spriteName !== 'Stage') {
        list = this.context.vm.runtime.startHats('event_whenthisspriteclicked', null, _sprite);
      } else {
        list = this.context.vm.runtime.startHats('event_whenstageclicked', null, _sprite);
      }

      // if not sync, don't wait until the threads handling the event finished executing
      if (!sync) {
        resolve('async resolve');
      }

      const topBlocks = [];
      for (const thread of list) {
        topBlocks.push(thread.topBlock);
      }

      const action = new Action(this.context, topBlocks);
      this.context.activeActions.push(action);

      setTimeout(() => {
        if (!sync) {
          console.log(`Timeout after ${timeout} ms`);
          this.context.vm.stopAll();
          this.context.simulationEnd.resolve();
        }
        reject();
      }, timeout);

      action.actionEnded.promise.then(() => {

        let extraWaitTime = 0;
        const timeSpend = Date.now() - startTime;
        if (delay > timeSpend) {
          extraWaitTime = delay - timeSpend;
        }

        setTimeout(() => {

          console.log(`finished click on ${spriteName}`);
          // save sprites state after click
          event.nextFrame = new LogFrame(this.context, 'clickEnd');
          if (sync) {
            resolve('sync resolve');
          }

        }, extraWaitTime);
      });
    }, 0, `CLICK ${spriteName}`);

  }

  /** @return {SimulationEvent} */
  greenFlag(data = {}) {
    return this.next((resolve, reject) => {

      const delay = data.delay || 0;
      const timeout = data.timeout || this.context.actionTimeout;
      let sync = data.sync;
      if (sync === undefined) sync = true;

      const startTime = Date.now();

      const event = new LogEvent(this.context, 'greenFlag');
      event.previousFrame = new LogFrame(this.context, 'greenFlag');
      this.context.log.addEvent(event);

      const list = this.context.vm.runtime.startHats('event_whenflagclicked');

      // if not sync, don't wait until the threads handling the event finished executing
      if (!sync) {
        resolve('async resolve');
      }

      const topBlocks = [];
      for (const thread of list) {
        topBlocks.push(thread.topBlock);
      }

      const action = new Action(this.context, topBlocks);
      this.context.activeActions.push(action);

      setTimeout(() => {
        if (!sync) {
          console.log(`Timeout after ${timeout} ms`);
          this.context.vm.stopAll();
          this.context.simulationEnd.resolve();
        }
        reject();
      }, timeout);

      action.actionEnded.promise.then(() => {

        let extraWaitTime = 0;
        const timeSpend = Date.now() - startTime;
        if (delay > timeSpend) {
          extraWaitTime = delay - timeSpend;
        }

        setTimeout(() => {
          console.log(`finished greenFlag()`);
          event.nextFrame = new LogFrame(this.context, 'greenFlagEnd');
          if (sync) {
            resolve('sync resolve');
          }
        }, extraWaitTime);
      });
    }, 0, "GREEN FLAG");
  }
  
  // TODO: better implementation; can this be sync?
  pressKeySecond(data = {}) {
    // TODO: find running threads waiting on this key press.
    // We could just check the blocks.
    return this.next((resolve, reject) => {
      this.context.vm.runtime.ioDevices.keyboard.postData({key: data.key, isDown: true});
      resolve();
    })
    
  }

  pressKey(data = {}) {

    return this.next((resolve, reject) => {

      const key = data.key || ' ';
      const delay = data.delay || 0;
      const timeout = data.timeout || this.context.actionTimeout;
      let sync = data.sync;
      if (sync === undefined) sync = true;

      const startTime = Date.now();
      console.log(`${this.context.timestamp()}: press ${key}`);

      this.context.output.startTestCase(`Druk op toets: ${key}`);

      // save sprites state before click
      const event = new LogEvent(this.context, 'key', { key: key });
      event.previousFrame = new LogFrame(this.context, 'key');
      this.context.log.addEvent(event);

      const keyData = { key: key, isDown: true };
      const scratchKey = this.context.vm.runtime.ioDevices.keyboard._keyStringToScratchKey(data.key);

      if (scratchKey === '') {
        console.log('Geen herkende key meegegeven');
        reject();
      }

      const list = this.context.vm.runtime.startHats('event_whenkeypressed', {
        KEY_OPTION: scratchKey
      });

      const list2 = this.context.vm.runtime.startHats('event_whenkeypressed', {
        KEY_OPTION: 'any'
      });

      // if not sync, don't wait until the threads handling the event finished executing
      if (!sync) {
        resolve('async resolve');
      }

      const topBlocks = [];
      for (const thread of list) {
        topBlocks.push(thread.topBlock);
      }
      for (const thread of list2) {
        topBlocks.push(thread.topBlock);
      }

      const action = new Action(this.context, topBlocks);
      this.context.activeActions.push(action);

      setTimeout(() => {
        if (!sync) {
          console.log(`Timeout after ${timeout} ms`);
          this.context.vm.stopAll();
          this.context.simulationEnd.resolve();
        }
        reject();
      }, timeout);

      action.actionEnded.promise.then(() => {

        let extraWaitTime = 0;
        const timeSpend = Date.now() - startTime;
        if (delay > timeSpend) {
          extraWaitTime = delay - timeSpend;
        }

        setTimeout(() => {

          console.log(`finished keyPress on ${key}`);
          // save sprites state after click
          event.nextFrame = new LogFrame(this.context, 'keyEnd');
          if (sync) {
            resolve('sync resolve');
          }

        }, extraWaitTime);
      });
    }, 0, `PRESS KEY ${data.key}`);

  }

  moveMouse(data = {}) {
    return this.next((resolve, reject) => {
      data.x = data.x + 240;
      data.y = data.y + 180;
      data.canvasWidth = 480;
      data.canvasHeight = 360;
      this.context.vm.runtime.ioDevices.mouse.postData(data);
      resolve();
    }, 0, "MOUSE");
  }

  test(testName, messageIfWrong, fun) {
    return this.next((resolve, reject) => {
      const correct = fun(this.context.log);
      this.context.output.addCase(testName, correct, messageIfWrong);
      resolve();
    }, 0, "TEST");
  }

  /**
   * Generate a new event that will save a frame, optionally doing something the the log
   * after the frame has been saved.
   *
   * @param {function(Log): void} fun
   * @return {SimulationEvent}
   */
  log(fun = (_l) => {}) {
    return this.next((resolve, reject) => {
      this.context.log.addFrame(this.context, 'manual_logging');
      fun(this.context.log);
      resolve();
    }, 0, "LOG");
  }

  reset() {
    this.context.log = new Log();
  }

  end() {
    return this.next((resolve, reject) => {
      for (const event of this.context.log.events.list) {
        if (event.nextFrame == null) {
          event.nextFrame = new LogFrame(this.context, 'programEnd');
        }
      }
      resolve();

      // stop all Scratch processes
      this.context.vm.stopAll();
      this.context.simulationEnd.resolve();
    }, 0, "END");
  }
}
