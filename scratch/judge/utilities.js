/**
 * Check if two arrays are equal to each other.
 *
 * @param {Array|null} one
 * @param {Array|null} two
 *
 * @return {boolean}
 */
export function compareArrays(one, two) {
  if (one === null && two === null) {
    return true;
  }
  if (one === null || two === null) {
    return false;
  }
  if (one.length !== two.length) {
    return false;
  }
  let i = one.length;
  while (i--) {
    if (one[i] !== two[i]) return false;
  }
  return true;
}
