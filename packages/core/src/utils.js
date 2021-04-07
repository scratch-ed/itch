/**
 * Check if two floating points are equal, considering
 * the given epsilon.
 *
 * @param {number} float1
 * @param {number} float2
 * @param {number } epsilon
 *
 * @return {boolean} True if the two are equal, false otherwise.
 */
export function numericEquals(float1, float2, epsilon = 0.0001) {
  return Math.abs(float1 - float2) < epsilon;
}

/**
 * Convert a value or function to a function.
 * 
 * If the argument is a function, return it.
 * Otherwise, returns a function that returns the value.
 * 
 * @template T
 * @param {T|null|undefined|function():T} functionOrObject
 * @return {function():T}
 */
export function castCallback(functionOrObject) {
  if (typeof functionOrObject === 'function') {
    return functionOrObject;
  } else {
    return () => functionOrObject;
  }
}