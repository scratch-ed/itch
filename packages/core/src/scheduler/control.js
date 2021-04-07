import { ScheduledAction } from './action.js';

export class SetSpritePositionAction extends ScheduledAction {
  /**
   * @param {string} spriteName
   * @param {number} x
   * @param {number} y
   */
  constructor(spriteName, x, y) {
    super();
    this.spriteName = spriteName;
    this.x = x;
    this.y = y;
  }

  execute(context, resolve) {
    /** @type {RenderedTarget} */
    const target = context.vm.runtime.getSpriteTargetByName(this.spriteName);
    if (!target) {
      throw new Error(`Could not find target ${this.spriteName}`);
    }
    target.setXY(this.x, this.y);
    resolve(`finished ${this}`);
  }

  toString() {
    return `${super.toString()} on ${this.sprite} to (${this.x},${this.y})`;
  }
}
