/* Copyright (C) 2019 Ghent University - All Rights Reserved */
export class SimulationEvent {
  constructor(context, action, delay) {

    this.context = context;
    
    // delay after action is executed
    this.delay = delay || 0;

    const f = function (resolve, reject) {
      setTimeout(() => {
        resolve('Start event resolved');
      }, this.delay);
    };
    // action that needs to be executed
    this.action = action || f;

    // events to be executed after this event has been executed
    this.nextEvents = [];

  }

  async launch() {
    const executeAction = new Promise((resolve, reject) => {
      console.log("Executed action...");
      this.action(resolve, reject);
    });

    const vm = this.context.vm;
    console.log("Doing promise new event...");
    return executeAction.then(() => {
      for (const event of this.nextEvents) {
        console.log("Launching new event...");
        console.log(event);
        event.launch();
      }
    }, (reason) => {
      console.log(reason);
      console.log('Test ended: time limit exceeded');
      vm.stopAll();
      addError('Time limit exceeded!');
    });
  }

  nextEvent(event) {

    // add next event to the list of events
    this.nextEvents.push(event);

    // return the next event (for chaining purposes)
    return event;

  }

  next(action, delay = 0) {

    // create the next event based on the given action and delay
    return this.nextEvent(new this.constructor(this.context, action, delay));

  }

  // generate multiple event generators; the first event generator will be
  // anchored to the current event; each event generator can return an event
  // that will serve as an anchor for the next event generator
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

  wait(delay) {

    return this.next((resolve, reject) => {

      console.log(`waiting for ${delay}`);

      setTimeout(() => {
        resolve('wait resolved');
      }, delay);
    });

  }
}
