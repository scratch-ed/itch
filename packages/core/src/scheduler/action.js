/**
 * Base class for scheduled actions.
 *
 * When implementing an action, you should override the `execute` function.
 * Its docs contain information on what to do.
 *
 * This is a class internal to the judge; do not use it in testplans.
 *
 * @package
 */
export class ScheduledAction {
  /**
   * Execute the action. This should do what the action is supposed to do,
   * but should not concern itself with scheduling details.
   *
   * This method should be "sync": the resolve callback must be called when
   * the event is done, async or not. The framework will take care of the
   * async/sync scheduling.
   *
   * @param {Context} _context - The context.
   * @param {function(T):void} _resolve - Mark the action as done.
   */
  execute(_context, _resolve) {
    throw new Error('You must implement and execution action.');
  }

  /**
   * Human readable string representation. The default implementation
   * returns the class name, but you should override this to add relevant
   * params.
   *
   * @return {string}
   */
  toString() {
    return this.constructor.name;
  }
}
