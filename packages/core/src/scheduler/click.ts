import { ScheduledAction } from './action';
import { ThreadListener } from '../listener';
import { Context } from '../context';
import { Event } from '../new-log';

const STAGE = 'Stage';

export class ClickSpriteAction extends ScheduledAction {
  sprite: string;

  constructor(spriteName: string) {
    super();
    this.sprite = spriteName;
  }

  execute(context: Context, resolve: (v: string) => void): void {
    // Get the sprite
    let sprite;
    if (this.sprite !== STAGE) {
      sprite = context.vm!.runtime.getSpriteTargetByName(this.sprite);
    } else {
      sprite = context.vm!.runtime.getTargetForStage();
    }

    // Save the state of the sprite before the click event.
    const event = new Event('click', { target: this.sprite });
    event.previous = context.log.snap(context.vm!, 'event.click.start');
    context.log.registerEvent(event);

    // Simulate mouse click by explicitly triggering click event on the target
    let list;
    if (this.sprite !== STAGE) {
      list = context.vm!.runtime.startHats(
        'event_whenthisspriteclicked',
        undefined,
        sprite,
      );
    } else {
      list = context.vm!.runtime.startHats('event_whenstageclicked', undefined, sprite);
    }

    const action = new ThreadListener(list);
    context.threadListeners.push(action);

    action.promise.then(() => {
      console.log(`finished click on ${this.sprite}`);
      // save sprites state after click
      event.next = context.log.snap(context.vm!, 'event.click.end');
      resolve(`finished ${this}`);
    });
  }

  toString(): string {
    return `${super.toString()} on ${this.sprite}`;
  }
}
