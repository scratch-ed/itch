import { Event } from '../log';
import { ScheduledAction } from './action';
import { Context } from '../context';

export interface SavedRangeEventData {
  /**
   * Name of the save range.
   */
  readonly name: string;
}

export class CallbackAction extends ScheduledAction {
  callback: () => void;

  constructor(callback: () => void) {
    super();
    this.callback = callback;
  }

  execute(context: Context, resolve: (v: string) => void): void {
    this.callback();
    resolve(`finished ${this}`);
  }
}

export class StartRange extends ScheduledAction {
  constructor(private name: string) {
    super();
  }

  execute(context: Context, resolve: (value: string) => void) {
    context.log.snap(`start:${this.name}`);
    resolve(`finished ${this}`);
  }
}

export class EndRange extends ScheduledAction {
  constructor(private name: string) {
    super();
  }

  execute(context: Context, resolve: (value: string) => void) {
    const snapshot = context.log.snap(`end:${this.name}`);
    const event = new Event('savedRange');
    const previous = context.log.snapshots.find((s) => s.origin == `start:${this.name}`)!;
    if (!previous) {
      throw new Error(
        'Could not find start snapshot. Did you call `startRange` on the scheduler?',
      );
    }
    event.previous = previous;
    event.next = snapshot;
    context.log.registerEvent(event);
    resolve(`finished ${this}`);
  }
}
