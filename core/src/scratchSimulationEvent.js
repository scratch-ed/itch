/* eslint-disable no-unused-vars */
import { SimulationEvent } from './simulationEvent';
import { LogEvent, LogFrame } from './log';
import { Action } from './scratchThreads';

function getTimeStamp() {
  return Date.now() - window.startTimestamp || 0;
}

/* Copyright (C) 2019 Ghent University - All Rights Reserved */
export class ScratchSimulationEvent extends SimulationEvent {

  start() {
    return this.next((resolve, reject) => {
      // Give sprites 500 ms to load
      setTimeout(() => {
        resolve();
      }, 300);
    });
  }

  clickSprite(data = {}) {

    return this.next((resolve, reject) => {

      const spriteName = data.spriteName || 'Stage';
      const delay = data.delay || 0;
      const timeout = data.timeout || actionTimeout;
      let sync = data.sync;
      if (sync === undefined) sync = true;

      const startTime = Date.now();
      console.log(`${getTimeStamp()}: click ${spriteName}`);

      dodona.startTestCase(`Klik op sprite: ${spriteName}`);

      // fetch the target
      const _sprite = Scratch.vm.runtime.getSpriteTargetByName(spriteName);

      // save sprites state before click
      const event = new LogEvent('click', { target: spriteName });
      event.previousFrame = new LogFrame(Scratch.vm, 'click');
      log.addEvent(event);

      // simulate mouse click by explicitly triggering click event on
      // the target
      let list;
      if (spriteName !== 'Stage') {
        list = Scratch.vm.runtime.startHats('event_whenthisspriteclicked', null, _sprite);
      } else {
        list = Scratch.vm.runtime.startHats('event_whenstageclicked', null, _sprite);
      }

      // if not sync, don't wait until the threads handling the event finished executing
      if (!sync) {
        resolve('async resolve');
      }

      const topBlocks = [];
      for (const thread of list) {
        topBlocks.push(thread.topBlock);
      }

      const action = new Action(topBlocks);
      activeActions.push(action);

      setTimeout(() => {
        if (!sync) {
          console.log(`Timeout after ${timeout} ms`);
          Scratch.vm.stopAll();
          Scratch.simulationEnd.resolve();
        }
        reject();
      }, timeout);

      action.actionEnded.promise.then(() => {

        let extraWaitTime = 0;
        const timeSpend = Date.now() - startTime;
        if (delay > timeSpend) {
          extraWaitTime = delay - timeSpend;
        }

        setTimeout(() => {

          console.log(`finished click on ${spriteName}`);
          // save sprites state after click
          event.nextFrame = new LogFrame(Scratch.vm, 'clickEnd');
          if (sync) {
            resolve('sync resolve');
          }

        }, extraWaitTime);
      });
    });

  }

  greenFlag(data = {}) {
    return this.next((resolve, reject) => {

      const delay = data.delay || 0;
      const timeout = data.timeout || actionTimeout;
      let sync = data.sync;
      if (sync === undefined) sync = true;

      const startTime = Date.now();

      const event = new LogEvent('greenFlag');
      event.previousFrame = new LogFrame(Scratch.vm, 'greenFlag');
      log.addEvent(event);

      const list = Scratch.vm.runtime.startHats('event_whenflagclicked');

      // if not sync, don't wait until the threads handling the event finished executing
      if (!sync) {
        resolve('async resolve');
      }

      const topBlocks = [];
      for (const thread of list) {
        topBlocks.push(thread.topBlock);
      }

      const action = new Action(topBlocks);
      activeActions.push(action);

      setTimeout(() => {
        if (!sync) {
          console.log(`Timeout after ${timeout} ms`);
          Scratch.vm.stopAll();
          Scratch.simulationEnd.resolve();
        }
        reject();
      }, timeout);

      action.actionEnded.promise.then(() => {

        let extraWaitTime = 0;
        const timeSpend = Date.now() - startTime;
        if (delay > timeSpend) {
          extraWaitTime = delay - timeSpend;
        }

        setTimeout(() => {
          console.log(`finished greenFlag()`);
          event.nextFrame = new LogFrame(Scratch.vm, 'greenFlagEnd');
          if (sync) {
            resolve('sync resolve');
          }
        }, extraWaitTime);
      });
    });
  }

  pressKey(data = {}) {

    return this.next((resolve, reject) => {

      const key = data.key || ' ';
      const delay = data.delay || 0;
      const timeout = data.timeout || actionTimeout;
      let sync = data.sync;
      if (sync === undefined) sync = true;

      const startTime = Date.now();
      console.log(`${getTimeStamp()}: press ${key}`);

      dodona.startTestCase(`Druk op toets: ${key}`);

      // save sprites state before click
      const event = new LogEvent('key', { key: key });
      event.previousFrame = new LogFrame(Scratch.vm, 'key');
      log.addEvent(event);

      const keyData = { key: key, isDown: true };
      const scratchKey = Scratch.vm.runtime.ioDevices.keyboard._keyStringToScratchKey(data.key);

      if (scratchKey === '') {
        console.log('Geen herkende key meegegeven');
        reject();
      }

      const list = Scratch.vm.runtime.startHats('event_whenkeypressed', {
        KEY_OPTION: scratchKey
      });

      const list2 = Scratch.vm.runtime.startHats('event_whenkeypressed', {
        KEY_OPTION: 'any'
      });

      // if not sync, don't wait until the threads handling the event finished executing
      if (!sync) {
        resolve('async resolve');
      }

      const topBlocks = [];
      for (const thread of list) {
        topBlocks.push(thread.topBlock);
      }
      for (const thread of list2) {
        topBlocks.push(thread.topBlock);
      }

      const action = new Action(topBlocks);
      activeActions.push(action);

      setTimeout(() => {
        if (!sync) {
          console.log(`Timeout after ${timeout} ms`);
          Scratch.vm.stopAll();
          Scratch.simulationEnd.resolve();
        }
        reject();
      }, timeout);

      action.actionEnded.promise.then(() => {

        let extraWaitTime = 0;
        const timeSpend = Date.now() - startTime;
        if (delay > timeSpend) {
          extraWaitTime = delay - timeSpend;
        }

        setTimeout(() => {

          console.log(`finished keyPress on ${key}`);
          // save sprites state after click
          event.nextFrame = new LogFrame(Scratch.vm, 'keyEnd');
          if (sync) {
            resolve('sync resolve');
          }

        }, extraWaitTime);
      });
    });

  }

  moveMouse(data = {}) {
    return this.next((resolve, reject) => {
      data.x = data.x + 240;
      data.y = data.y + 180;
      data.canvasWidth = 480;
      data.canvasHeight = 360;
      Scratch.vm.runtime.ioDevices.mouse.postData(data);
      resolve();
    });
  }

  test(testName, messageIfWrong, fun) {
    return this.next((resolve, reject) => {
      const correct = fun(log);
      addCase(testName, correct, messageIfWrong);
      resolve();
    });
  }

  log(fun = (log) => {}) {
    return this.next((resolve, reject) => {
      log.addFrame(Scratch.vm, 'manual_logging');
      fun(log);
      resolve();
    });
  }

  reset() {
    log = new Log();
  }

  end() {
    return this.next((resolve, reject) => {
      console.log('Finished simulation');
      for (const event of log.events.list) {
        if (event.nextFrame == null) {
          event.nextFrame = new LogFrame(Scratch.vm, 'programEnd');
        }
      }
      resolve();

      // stop all Scratch processes
      Scratch.vm.stopAll();
      Scratch.simulationEnd.resolve();
    });

  }
}
