import { ScheduledAction } from './action.js';
import { LogEvent, LogFrame } from '../log.js';
import { ThreadListener } from '../listener.js';

/**
 * @package
 */
export class GreenFlagAction extends ScheduledAction {
  execute(context, resolve) {

    const event = new LogEvent(context, 'greenFlag');
    event.previousFrame = new LogFrame(context, 'greenFlag');
    context.log.addEvent(event);

    const list = context.vm.runtime.startHats('event_whenflagclicked');

    const action = new ThreadListener(list);
    context.threadListeners.push(action);
    action.promise.then(() => {
      console.log(`finished greenFlag()`);
      event.nextFrame = new LogFrame(context, 'greenFlagEnd');
      resolve('green flag resolved');
    });
  }
}
