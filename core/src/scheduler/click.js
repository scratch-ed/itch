import { ScheduledAction } from './action.js';
import { LogEvent, LogFrame } from '../log.js';
import { ThreadListener } from '../listener.js';

const STAGE = 'Stage';

/**
 * @package
 */
export class ClickSpriteAction extends ScheduledAction {
  /**
   * @param {string} spriteName
   */
  constructor(spriteName) {
    super();
    this.spriteName = spriteName;
  }

  execute(context, resolve) {
    // Get the sprite
    /** @type {Target} */
    let sprite;
    if (this.spriteName !== STAGE) {
      sprite = context.vm.runtime.getSpriteTargetByName(this.spriteName);
    } else {
      sprite = context.vm.runtime.getTargetForStage();
    }

    // Save the state of the sprite before the click event.
    const event = new LogEvent(context, 'click', { target: this.spriteName });
    event.previousFrame = new LogFrame(context, 'click');
    context.log.addEvent(event);

    // Simulate mouse click by explicitly triggering click event on the target
    let list;
    if (this.spriteName !== STAGE) {
      list = context.vm.runtime.startHats('event_whenthisspriteclicked', null, sprite);
    } else {
      list = context.vm.runtime.startHats('event_whenstageclicked', null, sprite);
    }

    const action = new ThreadListener(list);
    context.threadListeners.push(action);

    action.promise.then(() => {
      console.log(`finished click on ${this.spriteName}`);
      // save sprites state after click
      event.nextFrame = new LogFrame(context, 'clickEnd');
      resolve('sync resolve');
    });
  }

  toString() {
    return `${super.toString()} on ${this.sprite}`;
  }
}