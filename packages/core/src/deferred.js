/**
 * A "Deferred" like implementation on top of a Promise.
 */
export default class Deferred {
  constructor() {
    /**
     * The promise. Use this to await completion.
     * @type {Promise<any>}
     */
    this.promise = new Promise((resolve, reject) => {
      /**
       * Call to resolve the underlying promise.
       * @type {function(any): void}
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