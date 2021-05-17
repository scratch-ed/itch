import { ScheduledAction } from './action';
import { Context } from '../context';

import type Target from '@itch-types/scratch-vm/types/engine/target';

export class TrackSpriteAction extends ScheduledAction {
  name: string;

  constructor(sprite: string) {
    super();
    this.name = sprite;
  }

  execute(context: Context, resolve: (v: string) => void): void {
    const sprite = context.vm!.runtime.getSpriteTargetByName(this.name);
    if (!sprite) {
      throw new Error(`Sprite ${this.name} was not found in the runtime.`);
    }
    sprite.addListener('EVENT_TARGET_VISUAL_CHANGE', (target: Target) => {
      context.log.addFrame(context, `update_${target.getName()}`);
    });
    resolve('register complete');
  }
}
