function containsLoop(blocks) {
  for (let key in blocks) {
    if (key === "control_repeat" || key === "control_forever") return true;
  }
  return false;
}

function containsBlock(name, blocks) {
  for (let key in blocks) {
    if (key === name) return true;
  }
  return false;
}

function countExecutions(name, blocks) {
  for (let key in blocks) {
    if (key === name) return blocks[key];
  }
  return 0;
}
