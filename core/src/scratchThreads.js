/* Copyright (C) 2019 Ghent University - All Rights Reserved */
import Deferred from './deferred';

export async function promiseTimeout(future, ms) {

  // Create a promise that rejects in <ms> milliseconds
  const timeout = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('Timed out in ' + ms + 'ms.');
    }, ms);
  });

  const promise = new Promise((resolve, reject) => {
    future.promise.then(() => resolve());
  });

  // Returns a race between our timeout and the passed in promise
  return Promise.race([
    promise,
    timeout
  ]);
}

export class Action {
  /**
   * 
   * @param {Context} context
   * @param topBlocks
   */
  constructor(context, topBlocks) {
    this.startTime = context.timestamp();
    this.topBlocks = topBlocks;
    this.actionEnded = new Deferred();
    this.active = true;

    // if the list with topBlocks is empty, no threads have started
    if (topBlocks === undefined || topBlocks.length === 0) {
      this.actionEnded.resolve();
    }
  }

  update(topBlock) {
    const newTopBlocks = [];
    for (const topB of this.topBlocks) {
      if (topB !== topBlock) {
        newTopBlocks.push(topB);
      }
    }
    if (newTopBlocks.length === 0) {
      this.actionEnded.resolve();
      this.active = false;
    }
    this.topBlocks = newTopBlocks;
  }
}
