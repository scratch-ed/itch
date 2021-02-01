/**
 * A "Deferred" like implementation on top of a Promise.
 * 
 * @template R
 */
export default class Deferred {
  constructor() {
    /**
     * The promise. Use this to await completion.
     * @type {Promise<R>}
     */
    this.promise = new Promise((resolve, reject) => {
      /**
       * Call to resolve the underlying promise.
       * @type {function(R): void}
       */
      this.resolve = resolve;
      /**
       * Call to reject the underlying promise.
       * @type {function(Error): void}
       */
      this.reject = reject;
    });
  }
}