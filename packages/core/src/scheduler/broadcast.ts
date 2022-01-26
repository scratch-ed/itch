import { ScheduledAction } from './action';
import { ThreadListener } from '../listener';
import { Context } from '../context';
import { Event } from '../new-log';

import type Target from '@ftrprf/judge-scratch-vm-types/types/engine/target';

export class SendBroadcastAction extends ScheduledAction {
  private readonly name: string;
  private readonly targetRestriction?: (c: Context) => Target;

  constructor(name: string, target?: (c: Context) => Target) {
    super();
    this.name = name;
    this.targetRestriction = target;
  }

  execute(context: Context, resolve: (v: string) => void): void {
    // Save the state of the sprite before the click event.
    const target = context.vm!.runtime.getTargetForStage()!;
    const restrictTo = this.targetRestriction
      ? this.targetRestriction(context)
      : undefined;
    const event = new Event('broadcast', {
      target: target.getName(),
      restrict: restrictTo?.getName(),
    });
    event.previous = context.log.snap('event.broadcast.start');
    context.log.registerEvent(event);

    const threads = context.vm!.runtime.startHats(
      'event_whenbroadcastreceived',
      {
        BROADCAST_OPTION: this.name,
      },
      restrictTo,
    );

    const action = new ThreadListener(threads);
    context.threadListeners.push(action);

    action.promise.then(() => {
      // save sprites state after click
      event.next = context.log.snap('event.broadcast.end');
      resolve(`finished ${this}`);
    });
  }

  toString(): string {
    return `${super.toString()} of ${this.name}`;
  }
}
