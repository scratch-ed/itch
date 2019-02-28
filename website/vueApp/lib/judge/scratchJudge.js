class Playground {
  constructor(log) {
    this.lines = log.lines;
    this.say = log.responses;
    this.ask = log.responses;
  }

  get lines() {
    return this._lines;
  }

  set lines(value) {
    this._lines = value;
  }

  get responses() {
    return this._responses;
  }

  set responses(value) {
    this._responses = value;
  }

  get squares() {
    return findSquares(this.lines);
  }

  get triangles() {
    return findTriangles(this.lines);
  }

  get mergedLines() {
    return mergeLines(this.lines);
  }
}

class AllBlocks {
  constructor(blocks) {
    this.blocks = blocks;
  }

  get blocks() {
    return this._blocks;
  }

  set blocks(value) {
    this._blocks = value;
  }

  containsLoop() {
    return containsLoop(this.blocks);
  }

  containsBlock(blockName) {
    return containsBlock(blockName, this.blocks);
  }

  numberOfExecutions(blockName) {
    return countExecutions(blockName, this.blocks);
  }
}

class Vm {
  constructor(vm) {
    //console.log(data);
    this.vm = vm;
  }
}

class Sprites {
  constructor(spritesLog) {
    this.sprites = spritesLog[spritesLog.length - 1].sprites; //sprites in the final states
    this.log = spritesLog;
  }

  print() {
    let res = [];
    for (let e in this.log) {
      let event = this.log[e];
      let spriteList = [];
      let sprites = event.sprites;
      for (let s in sprites) {
        let sprite = sprites[s];
        spriteList.push({name: sprite.name, x: Math.round(sprite.x * 100) / 100, y: Math.round(sprite.y * 100) / 100, costumeNr: sprite.currentCostume, costumeName: sprite.costume.name, visible: sprite.visible});
      }
      res.push({time: event.time, block: event.block, sprites: spriteList});
    }
    return res;
  }

  listSprites() {
    return this.data;
  }

  getSpriteIdByName(spriteName) {
    return getSpriteIdByName(spriteName, this.sprites);
  }

  containsLoop(spriteId) {
    return containsLoop(spriteId, this.sprites);
  }

  getStartSprites() {
    return this.log[0].sprites;
  }

  getSpritesAfterFirstBlockOccurance(blockName) {
    return getSpritesAfterBlock(blockName, 1, this.log);
  }

  getSpritesBeforeFirstBlockOccurance(blockName) {
    return getSpritesBeforeBlock(blockName, 1, this.log);
  }

  getSpritesAfterBlock(blockName, occurance) {
    return getSpritesAfterBlock(blockName, occurance, this.log);
  }

  getSpritesBeforeBlock(blockName, occurance) {
    return getSpritesBeforeBlock(blockName, occurance, this.log);
  }

  getCostume(spriteName) {
    return getSpriteByName(spriteName, this.sprites).costume.name;
  }

  isVisibleAtStart(spriteName) {
    return this.isVisible(spriteName, this.getStartSprites());
  }

  isVisibleAtEnd(spriteName) {
    return this.isVisible(spriteName, this.sprites);
  }

  isVisible(spriteName, sprites) {
    let spriteId = this.getSpriteIdByName(spriteName, sprites);
    return isVisible(spriteId, sprites);
  }

  getBlocks(spriteName) {
    let spriteId = this.getSpriteIdByName(spriteName, this.sprites);
    return getBlocks(spriteId, this.sprites);
  }


}

export class ScratchJudge {

  constructor() {
    this.numberOfRun = 0;
    this.simulation = new ScratchSimulationEvent(() => {
    }, 0);
    this.hasSimulation = false;
  }

  fill(data) {
    console.log(data);
    this.log = data.log;
    this.playground = new Playground(data.log);
    this.allBlocks = new AllBlocks(data.blocks);
    //this.vm = new Vm(data.vm);
    this.sprites = new Sprites(data.spritesLog);
  }

  get executionTime() {
    return this._executionTime;
  }

  set executionTime(value) {
    this._executionTime = value;
  }

  get keyInput() {
    return this._keyInput;
  }

  set keyInput(value) {
    this._keyInput = value;
  }

  get mouseInput() {
    return this._mouseInput;
  }

  set mouseInput(value) {
    this._mouseInput = value;
  }

  setSimulation() {
    simulationChain = this.simulation;
    this.hasSimulation = true;
  }

  async clickGreenFlag() {
    createProfiler();
    const data = await this._greenFlag();
    this.fill(data);
  }

  resetSimulation() {
    simulationChain = new ScratchSimulationEvent(() => {
    }, 0);
    this.hasSimulation = false;
    this.simulation = new ScratchSimulationEvent(() => {
    }, 0);
  }

  async _greenFlag() {
    greenFlag();
    await Scratch.ended.promise;
    if (this.hasSimulation) {
      await Scratch.simulationEnd.promise;
      this.resetSimulation();
    }
    return {log: logData, blocks: blocks, spritesLog: spritesLog, vm: {}};
  }


}

export function getScratch() {
  return new ScratchJudge();
}
