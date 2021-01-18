import _ from '../../node_modules/underscore/underscore.js';

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

  /**
   * Check if the costume of one of the sprites changed in comparison to
   * the given project.
   *
   * If the sprite does not exist in either project, it does not have
   * changed costumes. If it does not exist in only one, it will be
   * considered changed.
   *
   * @param {Project} other - Project to compare to.
   * @param {string} sprite - Name of the sprite to check.
   */
  hasChangedCostumes(other, sprite) {
    const myCostumeIds = this.sprite(sprite)
      ?.costumes
      ?.map(c => c.assetId);

    const otherCustomIds = other.sprite(sprite)
      ?.costumes
      ?.map(c => c.assetId);

    return !_.isEqual(myCostumeIds, otherCustomIds);
  }

  /**
   * Check if a sprite has changed position.
   *
   * If the sprite does not exist in either project, it does not have
   * changed positions. If it does not exist in only one, it will be
   * considered changed.
   *
   * @param {Project} other - Project to comapre to.
   * @param {string} sprite - Name of the sprite to check.
   */
  hasChangedPosition(other, sprite) {
    const mySprite = this.sprite(sprite);
    const otherSprite = other.sprite(sprite);

    return mySprite?.x !== otherSprite?.x || mySprite?.y !== otherSprite?.y;
  }

  /**
   * Check if the project contains a sprite.
   *
   * @param {string} sprite - Name of the sprite.
   * @return {boolean}
   */
  containsSprite(sprite) {
    return this.sprite(sprite) !== null;
  }

  /**
   * Get the sprite with the given name.
   *
   * @param {string} name - The name.
   *
   * @return {Object | null} The sprite or null if not found.
   * @private
   */
  sprite(name) {
    return this.json.targets.find(t => t.name === name) || null;
  }
}
