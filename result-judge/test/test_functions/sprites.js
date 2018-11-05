
function isShown(sprite, sprites) {
    for (let index in blocks) {
        if (blocks[index].name === "control_repeat") return true;
    }
    return false;
}


module.exports = {
    isShown
};