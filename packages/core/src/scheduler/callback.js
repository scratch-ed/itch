import { ScheduledAction } from './action.js';

/**
 * @package
 */
export class CallbackAction extends ScheduledAction {
  /**
   * @param {function():void} callback
   */
  constructor(callback) {
    super();
    this.callback = callback;
  }

  execute(context, resolve) {
    context.log.addFrame(context, 'manual_logging');
    this.callback();
    resolve(`finished ${this}`);
  }
}
