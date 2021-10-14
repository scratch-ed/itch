import { ScheduledAction } from './action';
import { Context } from '../context';

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
