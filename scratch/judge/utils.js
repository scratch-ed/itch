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
function equals(float1, float2, epsilon = 0.0001) {
    return Math.abs(float1 - float2) < epsilon;
}