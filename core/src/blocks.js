/* Copyright (C) 2019 Ghent University - All Rights Reserved */
export function containsLoop(blocks) {
  for (const key in blocks) {
    if (key === 'control_repeat' || key === 'control_forever') return true;
  }
  return false;
}

export function containsBlock(name, blocks) {
  for (const key in blocks) {
    if (key === name) return true;
  }
  return false;
}

export function countExecutions(name, blocks) {
  for (const key in blocks) {
    if (key === name) return blocks[key];
  }
  return 0;
}
