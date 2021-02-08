/* Copyright (C) 2019 Ghent University - All Rights Reserved */
import Deferred from './deferred.js';

/**
 * Listens to thread updates and resolves once all initial threads
 * are finished.
 * 
 * This class is mostly registered in the event scheduler to wait
 * on a bunch of threads. Once all are resolved, the `actionEnded`
 * property will be resolved as well.
 */
export class ThreadListener {
  /**
   * Initialise the listener with the given threads.
   *
   * If there are no threads, the listener will resolve immediately.
   * 
   * @param {Context} context - The context.
   * @param {Thread[]} threads - The threads to wait on.
   */
  constructor(context, threads= []) {
    /** @private */
    this.threads = threads;
    /**
     * @private 
     * @type {Deferred}
     * */
    this.deffered = new Deferred();
    /** @private */
    this.active = true;
    
    if (threads.length === 0) {
      this.active = false;
      this.deffered.resolve('no threads in action');
    }
  }

  /**
   * @return {Promise<string>}
   */
  get promise() {
    return this.deffered.promise;
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
