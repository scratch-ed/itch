/* Copyright (C) 2019 Ghent University - All Rights Reserved */
/** @deprecated */
function hasRemovedSprites(templateJSON, testJSON) {
    let names = [];
    for (let target of templateJSON.targets) {
        names.push(target.name);
    }
    for (let target of testJSON.targets) {
        if (!names.includes(target.name)) {
            return true;
        }
    }
    return false;
}

//We check if the templateJSON does not have all sprites that testJSON has.
/** @deprecated */
function hasAddedSprites(templateJSON, testJSON) {
    return hasRemovedSprites(testJSON, templateJSON);
}

//Check if no costumes were added or removed from sprite with name spriteName
/** @deprecated */
function hasChangedCostumes(templateJSON, testJSON, spriteName) {
    let costumeIds = [];
    for (let target of templateJSON.targets) {
        if (target.name === spriteName) {
            for (let costume of target.costumes) {
                costumeIds.push(costume.assetId);
            }

        }
    }
    for (let target of testJSON.targets) {
        if (target.name === spriteName) {
            for (let costume of target.costumes) {
                if (!costumeIds.includes(costume.assetId)) {
                    return true;
                }
            }
        }
    }
    return false;
}

/** @deprecated */
function hasChangedPosition(templateJSON, testJSON, spriteName) {
    let x = 0;
    let y = 0;
    for (let target of templateJSON.targets) {
        if (target.name === spriteName) {
            x = target.x;
            y = target.y;

        }
    }
    for (let target of testJSON.targets) {
        if (target.name === spriteName) {
            if (target.x === x && target.y === y) {
                return true;
            }
        }
    }
    return false;
}

/** @deprecated */
function hasChangedSize(templateJSON, testJSON, spriteName) {
    let size = 0;
    for (let target of templateJSON.targets) {
        if (target.name === spriteName) {
            size = target.size;

        }
    }
    for (let target of testJSON.targets) {
        if (target.name === spriteName) {
            if (target.size === size) {
                return true;
            }
        }
    }
    return false;
}

/** @deprecated */
function objectIsEmpty(obj) {
    for(let key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

/** @deprecated */
function containsSprite(testJSON, spriteName) {
    for (let target of testJSON.targets) {
        if (target.name === spriteName) {
            return true;
        }
    }
    return false;
}
