import { ScheduledAction } from './action.js';
import { LogEvent, LogFrame } from '../log.js';
import { ThreadListener } from '../listener.js';

/** @package */
export class SendBroadcastAction extends ScheduledAction {
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
    const event = new LogEvent(context, 'broadcast', {
      target: target.getName(),
    });
    event.previousFrame = new LogFrame(context, 'broadcast');
    context.log.addEvent(event);

    const threads = context.vm.runtime.startHats(
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

  toString() {
    return `${super.toString()} of ${this.name}`;
  }
}
