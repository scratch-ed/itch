
function getSpriteByName(spriteName, frame) {
    let i;
    for (i = 0; i < frame.sprites.length; i++) {
        if (frame.sprites[i].name === spriteName) return frame.sprites[i];
    }
    return null;
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

