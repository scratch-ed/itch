import { ScheduledAction } from './action.js';
import { LogEvent, LogFrame } from '../log.js';
import { ThreadListener } from '../listener.js';

export class WhenPressKeyAction extends ScheduledAction {
  /**
   * @param {string} key
   */
  constructor(key) {
    super();
    this.key = key;
  }

  execute(context, resolve) {
    // Save sprites state before key press.
    const event = new LogEvent(context, 'key', { key: this.key });
    event.previousFrame = new LogFrame(context, 'key');
    context.log.addEvent(event);

    const scratchKey = context.vm.runtime.ioDevices.keyboard._keyStringToScratchKey(this.key);

    if (scratchKey === '') {
      throw new Error(`Unknown key press: '${this.key}'`);
    }

    const list = context.vm.runtime.startHats('event_whenkeypressed', {
      KEY_OPTION: scratchKey
    });

    const list2 = context.vm.runtime.startHats('event_whenkeypressed', {
      KEY_OPTION: 'any'
    });

    const threads = list.concat(list2);
    const action = new ThreadListener(threads);
    context.threadListeners.push(action);

    action.promise.then(() => {
      console.log(`finished keyPress on ${this.key}`);
      // save sprites state after click
      event.nextFrame = new LogFrame(context, 'keyEnd');
      resolve(`finished ${this}`);
    });
  }
}

export class MouseUseAction extends ScheduledAction {
  constructor(data) {
    super();
    this.data = data;
  }

  execute(context, resolve) {
    this.data.x = this.data.x + 240;
    this.data.y = this.data.y + 180;
    this.data.canvasWidth = 480;
    this.data.canvasHeight = 360;
    context.vm.runtime.ioDevices.mouse.postData(this.data);
    resolve(`finished ${this}`);
  }
}

export class KeyUseAction extends ScheduledAction {
  /**
   * @param {string} key
   * @param {boolean|number} down
   * @param {number} delay
   */
  constructor(key, down, delay) {
    super();
    this.key = key;
    this.down = down;
    this.delay = delay;
  }

  execute(context, resolve) {
    context.vm.postIOData('keyboard', {
      key: this.key,
      isDown: this.isDown(),
    });

    const delay = context.accelerateEvent(this.delay);
    const accelDown = context.accelerateEvent(this.down);

    if (this.isDelayed()) {
      setTimeout(() => {
        context.vm.postIOData('keyboard', {
          key: this.key,
          isDown: false,
        });
        setTimeout(() => {
          resolve(`finished delayed ${this}`);
        }, delay);
      }, accelDown);
    } else {
      setTimeout(() => {
        resolve(`finished ${this}`);
      }, delay);
    }
  }

  isDown() {
    if (this.isDelayed()) {
      return true;
    } else {
      return this.down;
    }
  }

  isDelayed() {
    return typeof this.down === 'number';
  }
}
