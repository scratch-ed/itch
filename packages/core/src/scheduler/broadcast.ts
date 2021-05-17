import { ScheduledAction } from './action';
import { LogEvent, LogFrame } from '../log';
import { ThreadListener } from '../listener';
import { Context } from '../context';

export class SendBroadcastAction extends ScheduledAction {
  name: string;

  constructor(name: string) {
    super();
    this.name = name;
  }

  execute(context: Context, resolve: (v: string) => void): void {
    // Save the state of the sprite before the click event.
    const target = context.vm!.runtime.getTargetForStage();
    const event = new LogEvent(context, 'broadcast', {
      target: target.getName(),
    });
    event.previousFrame = new LogFrame(context, 'broadcast');
    context.log.addEvent(event);

    const threads = context.vm!.runtime.startHats(
      'event_whenbroadcastreceived',
      {
        BROADCAST_OPTION: this.name,
      },
    );

    const action = new ThreadListener(threads);
    context.threadListeners.push(action);

    action.promise.then(() => {
      // save sprites state after click
      event.nextFrame = new LogFrame(context, 'broadcastEnd');
      resolve(`finished ${this}`);
    });
  }

  toString(): string {
    return `${super.toString()} of ${this.name}`;
  }
}
