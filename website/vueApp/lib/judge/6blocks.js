function containsLoop(blocks) {
  for (let index in blocks) {
    if (blocks[index].name === "control_repeat") return true;
  }
  return false;
}

function containsBlock(name, blocks) {
  console.log(blocks, blocks[2]);
  for (let index in blocks) {
    console.log(blocks[index].name, name);
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
