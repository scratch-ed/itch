
function containsLoop(blocks) {
    for (let index in blocks) {
        if (blocks[index].name === "control_repeat") return true;
    }
    return false;
}

function containsBlock(name, blocks) {
    for (let index in blocks) {
        if (blocks[index].name === name) return true;
    }
    return false;
}

function countExecutions(name, blocks) {
    for (let index in blocks) {
        if (blocks[index].name === name) return blocks[index].executions;
    }
    return 0;
}
