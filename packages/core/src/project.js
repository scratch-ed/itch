import { Sb3Json } from './structures.js';
import isEqual from 'lodash-es/isEqual.js';
import { asTree } from './blocks.js';

/**
 * A callback allowing comparison between two sprites.
 *
 * @callback SpritePredicate
 *
 * @param {Sb3Sprite|Sb3Stage} one - The first sprite, from the base project.
 * @param {Sb3Sprite|Sb3Stage} two - The second sprite, from the comparing project.
 *
 * @return {boolean} Value defined by usage.
 */

/**
 * Represents information about a Scratch project.
 *
 * Besides the query methods, the class also provides a bunch
 * of comparison methods, allowing for tests against two versions.
 */
export default class Project {
  /**
   * @param {Object} json - The JSON extracted from the sb3 file.
   */
  constructor(json) {
    /**
     * @type {Sb3Json}
     * @private
     */
    this.json = new Sb3Json(json);
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
    const names = new Set(other.json.targets.map((t) => t.name));
    return !this.json.targets.every((t) => names.has(t.name));
  }

  /**
   * Check if the given project has added sprites in comparison to this project.
   *
   * @param {Project} other - Project to check.
   *
   * @return {boolean}
   */
  hasAddedSprites(other) {
    const names = new Set(this.json.targets.map((t) => t.name));
    return other.json.targets.some((t) => !names.has(t.name));
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
    const myCostumeIds = this.sprite(sprite)?.costumes?.map((c) => c.assetId);

    const otherCustomIds = other
      .sprite(sprite)
      ?.costumes?.map((c) => c.assetId);

    return !isEqual(myCostumeIds, otherCustomIds);
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
   * The default predicate checks the sprite itself, but not it's blocks.
   *
   * @param {Project} other - Project to compare to.
   * @param {string} sprite - Name of the sprite.
   * @param {SpritePredicate} predicate - Return true if the sprite has changed.
   *
   * @return True if the sprite satisfies the change predicate.
   */
  hasChangedSprite(
    other,
    sprite,
    predicate = (s1, s2) =>
      !isEqual(s1.comparableObject(), s2.comparableObject()),
  ) {
    const baseSprite = this.sprite(sprite);
    const comparisonSprite = other.sprite(sprite);

    if (baseSprite === null && comparisonSprite === null) {
      return false;
    }

    if (baseSprite === null || comparisonSprite === null) {
      return true;
    }

    return predicate(baseSprite, comparisonSprite);
  }

  hasChangedBlocks(other, sprite) {
    return this.hasChangedSprite(other, sprite, (s1, s2) => {
      const set1 = asTree(s1);
      const set2 = asTree(s2);
      return !isEqual(set1, set2);
    });
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
   * @return {Sb3Sprite|Sb3Stage|null} The sprite or null if not found.
   */
  sprite(name) {
    return this.json.targets.find((t) => t.name === name) || null;
  }

  /**
   * @return {Sb3Sprite|Sb3Stage[]} A list of sprites in this project.
   */
  sprites() {
    return this.json.targets;
  }

  /**
   *
   * @param name
   * @return {null|{variable: Sb3Variable, target: Sb3Target}}
   */
  getVariable(name) {
    for (const target of this.json.targets) {
      for (const variable of Object.keys(target.variables)) {
        /** @type {Sb3Variable} */
        const varObject = target.variables[variable];
        if (varObject.name === name) {
          return { target, variable: varObject };
        }
      }
    }
    return null;
  }
}
