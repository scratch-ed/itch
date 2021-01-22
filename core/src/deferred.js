/**
 * A "Deferred" like implementation on top of a Promise.
 * 
 * @template R
 * 
 * @callback resolve
 * @param {R} value
 * @return void
 * 
 * @callback reject
 * @param {*} [reason]
 * @return void
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
       * @type {resolve}
       */
      this.resolve = resolve;
      /**
       * Call to reject the underlying promise.
       * @type {reject}
       */
      this.reject = reject;
    });
  }
}