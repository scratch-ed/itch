/* Copyright (C) 2019 Ghent University - All Rights Reserved */
import Deferred from './deferred.js';

export class Action {
  /**
   * 
   * @param {Context} context
   * @param topBlocks
   */
  constructor(context, topBlocks) {
    this.startTime = context.timestamp();
    this.topBlocks = topBlocks;
    /** @type {Deferred<string>} */
    this.actionEnded = new Deferred();
    this.active = true;

    // if the list with topBlocks is empty, no threads have started
    if (topBlocks === undefined || topBlocks.length === 0) {
      this.actionEnded.resolve('no threads found');
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
      this.actionEnded.resolve('all threads completed');
      this.active = false;
    }
    this.topBlocks = newTopBlocks;
  }
}
