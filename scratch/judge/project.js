/**
 * @typedef {Object} ProjectJson
 * @property {list} extensions - A list of used extension.
 * @property {list} monitors - A list of used monitors.
 * @property {Object} metadata - Some information about the project.
 * @property {list} targets - A list of used targets in the project.
 */

/**
 * Represents information about a Scratch project.
 *
 * Besides the query methods, the class also provides a bunch
 * of comparison methods, allowing for tests against two versions.
 */
export class Project {

    /**
     * @param {ProjectJson} json - The JSON extracted from the sb3 file.
     */
    constructor(json) {
        /**
         * @private
         */
        this.json = json;
    }

    /**
     * Check if the given project has removed sprites in comparison to this project.
     *
     * @param {Project} other - Project to check.
     *
     * @return {boolean}
     */
    hasRemovedSprites(other) {
        const names = new Set(other.json.targets.map(t => t.name));
        return !this.json.targets.every(t => names.has(t.name));
    }

    /**
     * Check if the given project has added sprites in comparison to this project.
     *
     * @param {Project} other - Project to check.
     *
     * @return {boolean}
     */
    hasAddedSprites(other) {
        const names = new Set(this.json.targets.map(t => t.name));
        return other.json.targets.some(t => !names.has(t.name));
    }
}
