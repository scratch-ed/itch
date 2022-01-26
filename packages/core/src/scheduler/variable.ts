import type Target from '@ftrprf/judge-scratch-vm-types/types/engine/target';

import { ScheduledAction } from './action';
import { Context } from '../context';
import { Event } from '../new-log';

const STAGE = 'Stage';

export class SetVariableAction extends ScheduledAction {
  private readonly value: unknown;
  private readonly target: string;
  private readonly name: string;

  constructor(target: string, name: string, value: unknown) {
    super();
    this.value = value;
    this.target = target;
    this.name = name;
  }

  execute(context: Context, resolve: (v: string) => void): void {
    // Save sprites state before key press.
    const event = new Event('set_variable', { value: this.value });
    event.previous = context.log.snap('event.set_variable');
    event.next = event.previous;
    context.log.registerEvent(event);

    let sprite: Target;
    if (this.target !== STAGE) {
      sprite = context.vm!.runtime.getSpriteTargetByName(this.name);
    } else {
      sprite = context.vm!.runtime.getTargetForStage() as Target;
    }

    // Get the variable ID.
    const varKey = Object.keys(sprite.variables).find(
      (key) => sprite.variables[key].name === this.name,
    )!;
    const variable = sprite.lookupVariableById(varKey);
    variable.value = this.value as string;

    resolve(`finished ${this}`);
  }
}
