/* Copyright (C) 2019 Ghent University - All Rights Reserved */
import Deferred from './deferred.js';

class Listener {
  constructor() {
    this.active = true;
    /**
     * @protected
     * @type {Deferred}
     * */
    this.deffered = new Deferred();
  }

  /**
   * @return {Promise<string>}
   */
  get promise() {
    return this.deffered.promise;
  }
}

/**
 * Listens to thread updates and resolves once all initial threads
 * are finished.
 *
 * This class is mostly registered in the event scheduler to wait
 * on a bunch of threads. Once all are resolved, the `actionEnded`
 * property will be resolved as well.
 */
export class ThreadListener extends Listener {
  /**
   * Initialise the listener with the given threads.
   *
   * If there are no threads, the listener will resolve immediately.
   *
   * @param {Thread[]} threads - The threads to wait on.
   */
  constructor(threads = []) {
    super();
    /** @private */
    this.threads = threads;

    if (threads.length === 0) {
      this.active = false;
      this.deffered.resolve('no threads in action');
    }
  }

  /**
   * Update the threads. This is called when the VM emits
   * a thread update event.
   *
   * @param {Thread} thread - A thread that has finished running.
   */
  update(thread) {
    this.threads = this.threads.filter(t => t !== thread);
    if (this.threads.length === 0) {
      this.deffered.resolve('all threads completed');
      this.active = false;
    }
  }
}

/**
 * Listens to broadcasts, and resolves once a broadcast has been found.
 */
export class BroadcastListener extends Listener {

  /**
   * @param {string} broadcastName
   */
  constructor(broadcastName) {
    super();
    this.name = broadcastName;
  }

  update(options) {
    if (options?.matchFields?.BROADCAST_OPTION === this.name) {
      this.deffered.resolve(`received broadcast ${this.name}`);
      this.active = false;
    }
  }
}
