class SimulationEvent {

    constructor(action, delay = 0) {

        // action that needs to be executed
        this._action = action;

        // delay before action is executed
        this._delay = delay;

        // events to be executed after this event has been executed
        this._nextEvents = [];

    }

    async launch() {

        // delayed execution of action
        setTimeout(() => {

            let executeAction = new Promise((resolve, reject) => {
                this._action(resolve, reject);
            });

            executeAction.then(() => {
                // execute next events one after the other
                for (let event of this._nextEvents) {
                    event.launch();
                }
            });

        }, this._delay);

    }

    nextEvent(event) {

        // add next event to the list of events
        this._nextEvents.push(event);

        // return the next event (for chaining purposes)
        return event;

    }

    next(action, delay = 0) {

        // create the next event based on the given action and delay
        return this.nextEvent(new this.constructor(action, delay));

    }

    // generate multiple event generators; the first event generator will be
    // anchored to the current event; each event generator can return an event
    // that will serve as an anchor for the next event generator
    fork(eventGenerators) {

        let anchor = this;
        let nextAnchor;

        // call each of the eventGenerators on the current event
        for (let eventGenerator of eventGenerators) {

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
        for (let index in items) {

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

        let anchor = this,        // start from event on which method is called
            index = 0,            // keep track of number of repetitions
            next = start,         // next event should be generated at start time
            delay = start;        // first delay equals start time

        while (next < stop) {

            // wait before generating next events
            anchor = anchor.wait(delay);

            // call event generator on the current event
            let nextAnchor = eventGenerator.call(anchor, index, anchor);

            // new anchor is event returned by event generator (if any)
            // NOTE: sequential behaviour only if event generator returns a
            //       value that is itself an event, that will serve as the
            //       anchor point for the next generation of events
            if (nextAnchor instanceof SimulationEvent) {
                anchor = nextAnchor;
            }

            // launch next event
            index += 1;
            delay = step;
            next += delay;

        }

        return anchor;

    }

    // utility functions for predefined actions

    wait(delay) {

        // register an event that does noting else but waiting (and return that event)
        return this.next((resolve, reject) => {
            resolve();
        }, delay);

    }

}



