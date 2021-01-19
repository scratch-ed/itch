/* Copyright (C) 2019 Ghent University - All Rights Reserved */

//We check if the templateJSON does not have all sprites that testJSON has.
/** @deprecated */
function hasAddedSprites(templateJSON, testJSON) {
    const template = new Project(templateJSON);
    const test = new Project(testJSON);
    return template.hasAddedSprites(test);
}

//Check if no costumes were added or removed from sprite with name spriteName
/** @deprecated */
function hasChangedCostumes(templateJSON, testJSON, spriteName) {
    const template = new Project(templateJSON);
    const test = new Project(testJSON);
    return template.hasChangedCostumes(test, spriteName);
}

/** @deprecated */
function hasChangedPosition(templateJSON, testJSON, spriteName) {
    const template = new Project(templateJSON);
    const test = new Project(testJSON);
    return template.hasChangedPosition(test, spriteName);
}

/** @deprecated */
function hasChangedSize(templateJSON, testJSON, spriteName) {
    const template = new Project(templateJSON);
    const test = new Project(testJSON);
    return template.hasChangedSprite(test, spriteName, (a, b) => a.size === b.size);
}

/** @deprecated */
function containsSprite(testJSON, spriteName) {
    return new Project(testJSON).containsSprite(spriteName);
}
