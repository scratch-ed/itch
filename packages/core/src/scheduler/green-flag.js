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

    // Stuff from the greenFlag function.
    context.vm.runtime.stopAll();
    context.vm.runtime.emit('PROJECT_START');
    context.vm.runtime.ioDevices.clock.resetProjectTimer();
    context.vm.runtime.targets.forEach((target) =>
      target.clearEdgeActivatedValues(),
    );
    // Inform all targets of the green flag.
    for (let i = 0; i < context.vm.runtime.targets.length; i++) {
      context.vm.runtime.targets[i].onGreenFlag();
    }

    const list = context.vm.runtime.startHats('event_whenflagclicked');

    const action = new ThreadListener(list);
    context.threadListeners.push(action);
    action.promise.then(() => {
      event.nextFrame = new LogFrame(context, 'greenFlagEnd');
      resolve(`finished ${this}`);
    });
  }
}
