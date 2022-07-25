import { ScheduledAction } from './action';
import { ThreadListener } from '../listener';
import { Context } from '../context';
import { Event } from '../log';

export class GreenFlagAction extends ScheduledAction {
  execute(context: Context, resolve: (v: string) => void): void {
    const event = new Event('greenFlag');
    event.previous = context.log.snap('event.greenFlag.start');
    context.log.registerEvent(event);

    // Stuff from the greenFlag function.
    context.vm!.runtime.stopAll();
    context.vm!.runtime.emit('PROJECT_START');
    context.vm!.runtime.ioDevices.clock.resetProjectTimer();
    context.vm!.runtime.targets.forEach((target) => target.clearEdgeActivatedValues());
    // Inform all targets of the green flag.
    for (let i = 0; i < context.vm!.runtime.targets.length; i++) {
      context.vm!.runtime.targets[i].onGreenFlag();
    }

    const list = context.vm!.runtime.startHats('event_whenflagclicked');

    const action = new ThreadListener(list);
    context.threadListeners.push(action);
    action.promise.then(() => {
      event.next = context.log.snap('event.greenFlag.end');
      resolve(`finished ${this}`);
    });
  }
}
