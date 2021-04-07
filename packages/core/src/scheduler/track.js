import { ScheduledAction } from './action.js';

export class TrackSpriteAction extends ScheduledAction {
  constructor(sprite) {
    super();
    this.name = sprite;
  }

  execute(context, resolve) {
    const sprite = context.vm.runtime.getSpriteTargetByName(this.name);
    if (!sprite) {
      throw new Error(`Sprite ${this.name} was not found in the runtime.`);
    }
    sprite.addListener('EVENT_TARGET_VISUAL_CHANGE', (target) => {
      context.log.addFrame(context, `update_${target.getName()}`);
    });
    resolve('register complete');
  }
}
