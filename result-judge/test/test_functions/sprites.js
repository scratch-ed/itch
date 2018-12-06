
function getSpriteIdByName(spriteName, sprites) {
    let i;
    for (i = 0; i < sprites.length; i++) {
        if (sprites[i].name === spriteName) return sprites[i].id;
    }
    return -1;
}

function getSpriteByName(spriteName, sprites) {
    let i;
    for (i = 0; i < sprites.length; i++) {
        if (sprites[i].name === spriteName) return sprites[i];
    }
    return -1;
}

function isVisible(spriteId, sprites) {
    let i;
    for (i = 0; i < sprites.length; i++) {
        if (sprites[i].id === spriteId) return sprites[i].visible;
    }
    return false;
}

function getCostume(spriteName, sprites) {
    let i;
}

function getSpritesAfterBlock(blockName, occurance, log) {
    let i;
    let j = 0;
    for (i = 0; i < log.length; i++) {
        if (log[i].block === blockName) {
            j++;
            if (j === occurance) {
                return log[i].sprites;
            }
        }
    }
    return -1; // no block with blockName found or less blocks found than given occurances.
}

function getSpritesBeforeBlock(blockName, occurance, log) {
    let i;
    let j = 0;
    for (i = 0; i < log.length; i++) {
        if (log[i].block === blockName) {
            j++;
            if (j === occurance) {
                return log[i-1].sprites;
            }
        }
    }
    return -1; // no block with blockName found or less blocks found than given occurances.
}


module.exports = {
    getSpriteIdByName,
    getSpriteByName,
    isVisible,
    getSpritesAfterBlock,
    getSpritesBeforeBlock
};