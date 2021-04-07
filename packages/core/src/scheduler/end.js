import { ScheduledAction } from './action.js';
import { LogFrame } from '../log.js';
import Deferred from '../deferred.js';
import Promise from 'lodash-es/_Promise.js';

/** @package */
export class EndAction extends ScheduledAction {
  execute(context, resolve) {
    for (const event of context.log.events.list) {
      if (event.nextFrame == null) {
        event.nextFrame = new LogFrame(context, 'programEnd');
      }
    }
    context.vm.stopAll();

    resolve(`finished ${this}`);
    context.simulationEnd.resolve('done with simulation');
  }
}

export class JoinAction extends ScheduledAction {
  /**
   * @param {ScheduledEvent[]} events
   */
  constructor(events) {
    super();
    const promises = events.map((e) => {
      const deferred = new Deferred();
      const oldExecute = e.action.execute;
      e.action.execute = (context, resolve) => {
        oldExecute.call(e.action, context, (value) => {
          deferred.resolve(value);
          resolve(value);
        });
      };
      return deferred.promise;
    });
    this.promise = Promise.race(promises);
  }

  execute(_context, resolve) {
    // Do nothing.
    this.promise.then(
      () => {
        console.log('Threads have been joined...');
        resolve();
      },
      (reason) => {
        throw reason;
      },
    );
  }
}
