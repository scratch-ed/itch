import { ScheduledAction } from './action.js';
import { LogFrame } from '../log.js';

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