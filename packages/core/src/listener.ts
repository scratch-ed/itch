/* Copyright (C) 2019 Ghent University - All Rights Reserved */
import { Deferred } from './deferred';

import Thread from '@itch-types/scratch-vm/types/engine/thread';

class Listener {
  active: boolean = true;
  protected deferred: Deferred<string> = new Deferred();

  /**
   * @return {Promise<string>}
   */
  get promise() {
    return this.deferred.promise;
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
  private threads: Thread[];

  /**
   * Initialise the listener with the given threads.
   *
   * If there are no threads, the listener will resolve immediately.
   *
   * @param threads - The threads to wait on.
   */
  constructor(threads: Thread[] = []) {
    super();
    this.threads = threads;

    if (threads.length === 0) {
      this.active = false;
      this.deferred.resolve('no threads in action');
    }
  }

  /**
   * Update the threads. This is called when the VM emits
   * a thread update event.
   *
   * @param thread - A thread that has finished running.
   */
  update(thread: Thread) {
    this.threads = this.threads.filter((t) => t !== thread);
    if (this.threads.length === 0) {
      this.deferred.resolve('all threads completed');
      this.active = false;
    }
  }
}

interface BroadcastUpdate {
  matchFields: Record<string, any>,
  target: any,
}

/**
 * Listens to broadcasts, and resolves once a broadcast has been found.
 */
export class BroadcastListener extends Listener {
  name: string;

  constructor(broadcastName: string) {
    super();
    this.name = broadcastName;
  }

  update(options: BroadcastUpdate) {
    if (options?.matchFields?.BROADCAST_OPTION === this.name) {
      this.deferred.resolve(`received broadcast ${this.name}`);
      this.active = false;
    }
  }
}