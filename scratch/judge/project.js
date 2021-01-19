/**
 * @typedef {Object} ProjectJson
 * @property {list} extensions - A list of used extension.
 * @property {list} monitors - A list of used monitors.
 * @property {Object} metadata - Some information about the project.
 * @property {LoggedSprite[]} targets - A list of used targets in the project.
 */

/**
 * A callback allowing comparison between two sprites.
 *
 * @callback SpritePredicate
 *
 * @param {LoggedSprite} one - The first sprite, from the base project.
 * @param {LoggedSprite} two - The second sprite, from the comparing project.
 *
 * @return {boolean} Value defined by usage.
 */

/**
 * Represents information about a Scratch project.
 *
 * Besides the query methods, the class also provides a bunch
 * of comparison methods, allowing for tests against two versions.
 */
class Project {
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
   * @example
   * const template = new Project({..});
   * const submission = new Project({});
   *
   * template.hasRemovedSprites(submission);
   * // Returns true if the student removed some sprites.
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
   * Check if a sprite has changed between this project and the given project,
   * as defined by the predicate. This allows for every flexible checks.
   *
   * The function handles cases where sprites are missing:
   * - If missing in both, returns false.
   * - If missing in one, but not the other, returns true.
   * - Else pass to the predicate.
   *
   * For example, to check if a given sprite has changed position:
   *
   * @example
   *  const template = new Project(templateJSON);
   *  const test = new Project(testJSON);
   *  template.hasChangedSprite(test, "test", (a, b) => a.size === b.size);
   *
   * @param {Project} other - Project to compare to.
   * @param {string} sprite - Name of the sprite.
   * @param {SpritePredicate} predicate - Return true if the sprite has changed.
   *
   * @return True if the sprite satisfies the change predicate.
   */
  hasChangedSprite(other, sprite, predicate) {
    const baseSprite = this.sprite(sprite);
    const comparisonSprite = this.sprite(sprite);

    if (baseSprite === null && comparisonSprite === null) {
      return false;
    }

    if (baseSprite === null || comparisonSprite === null) {
      return true;
    }

    return predicate(baseSprite, comparisonSprite);
  }

  /**
   * Check if a sprite has changed position.
   *
   * If the sprite does not exist in either project, it does not have
   * changed positions. If it does not exist in only one, it will be
   * considered changed.
   *
   * @param {Project} other - Project to compare to.
   * @param {string} sprite - Name of the sprite to check.
   */
  hasChangedPosition(other, sprite) {
    return this.hasChangedSprite(other, sprite, (one, two) => {
      return one.x !== two.x || one.y !== two.y;
    });
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
   * @return {LoggedSprite | null} The sprite or null if not found.
   * @private
   */
  sprite(name) {
    return this.json.targets.find(t => t.name === name) || null;
  }

  /**
   * @return {LoggedSprite[]} A list of sprites in this project.
   */
  sprites() {
    return this.json.targets;
  }
}

if (typeof exports !== 'undefined') {
  module.exports = Project;
}
