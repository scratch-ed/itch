import { ScheduledAction } from './action';
import { ThreadListener } from '../listener';
import { Context } from '../context';
import { Event } from '../log';

export class WhenPressKeyAction extends ScheduledAction {
  key: string;

  constructor(key: string) {
    super();
    this.key = key;
  }

  execute(context: Context, resolve: (v: string) => void): void {
    // Save sprites state before key press.
    const event = new Event('key', { key: this.key });
    event.previous = context.log.snap('event.key.start');
    context.log.registerEvent(event);

    const scratchKey = context.vm!.runtime.ioDevices.keyboard._keyStringToScratchKey(
      this.key,
    );

    if (scratchKey === '') {
      throw new Error(`Unknown key press: '${this.key}'`);
    }

    const list = context.vm!.runtime.startHats('event_whenkeypressed', {
      KEY_OPTION: scratchKey,
    });

    const list2 = context.vm!.runtime.startHats('event_whenkeypressed', {
      KEY_OPTION: 'any',
    });

    const threads = list.concat(list2);
    const action = new ThreadListener(threads);
    context.threadListeners.push(action);

    action.promise.then(() => {
      console.log(`finished keyPress on ${this.key}`);
      // save sprites state after click
      event.next = context.log.snap('event.key.end');
      resolve(`finished ${this}`);
    });
  }
}

export interface MouseData {
  x: number;
  y: number;
  canvasWidth?: number;
  canvasHeight?: number;
}

export class MouseUseAction extends ScheduledAction {
  data: MouseData;

  constructor(data: MouseData) {
    super();
    this.data = data;
  }

  execute(context: Context, resolve: (v: string) => void): void {
    this.data.x = this.data.x + 240;
    this.data.y = this.data.y + 180;
    this.data.canvasWidth = 480;
    this.data.canvasHeight = 360;
    context.vm!.runtime.ioDevices.mouse.postData(this.data);
    resolve(`finished ${this}`);
  }
}

export class KeyUseAction extends ScheduledAction {
  key: string;
  down: boolean | number;
  delay: number;

  constructor(key: string, down: boolean | number, delay: number) {
    super();
    this.key = key;
    this.down = down;
    this.delay = delay;
  }

  execute(context: Context, resolve: (v: string) => void): void {
    const event = new Event('useKey', {
      key: this.key,
      down: this.down,
      delay: this.delay,
    });
    event.previous = context.log.snap('event.keyUse.start');
    context.log.registerEvent(event);

    context.vm!.postIOData('keyboard', {
      key: this.key,
      isDown: this.isDown(),
    });

    const delay = context.accelerateEvent(this.delay);
    const accelDown = context.accelerateEvent(this.down);

    if (this.isDelayed()) {
      setTimeout(() => {
        event.next = context.log.snap('event.keyUse.end');
        context.vm!.postIOData('keyboard', {
          key: this.key,
          isDown: false,
        });
        setTimeout(() => {
          resolve(`finished delayed ${this}`);
        }, delay);
      }, accelDown as number);
    } else {
      setTimeout(() => {
        event.next = context.log.snap('event.keyUse.end');
        resolve(`finished ${this}`);
      }, delay);
    }
  }

  private isDown(): boolean | number {
    if (this.isDelayed()) {
      return true;
    } else {
      return this.down;
    }
  }

  private isDelayed(): boolean {
    return typeof this.down === 'number';
  }
}
