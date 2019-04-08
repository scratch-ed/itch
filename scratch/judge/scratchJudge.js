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
    constructor(log) {
        this.blocks = log.blocks;
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
    constructor() {
        //list of sprites in final frame
        this.sprites = log.currentFrame.sprites;
    }

    containsLoop(spriteId) {
        return containsLoop(spriteId, this.sprites);
    }

    getStartSprites() {
        return log.frames[0].sprites;
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

        let sprite = getSpriteByName(spriteName, this.sprites);
        if (sprite) {
            return sprite.costume;
        } else {
            return `Error: Er bestaat geen sprite met naam: ${spriteName}`
        }
    }

    stayedInBounds(spriteName) {
        for (let i in this.log) {
            let s = this.log[i];
            for (let j in s) {
                let sprite = s[j];
                if (sprite.name === spriteName) {

                }
            }
        }
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

class ScratchJudge {

    constructor() {
        this.numberOfRun = 0;
        this.simulation = new ScratchSimulationEvent((resolve, reject) => {
            resolve();
        }, 0).start();
        this.hasSimulation = false;
        //this.capture = [];
        this.log = {};
        this.blocks = {};
        this.playground = {};
        this.sprites = {};
    }

    fill(data) {
        console.log(data);
        this.log = data.log;
        this.playground = new Playground(data.log);
        this.blocks = new AllBlocks(log);
        this.sprites = new Sprites(log);
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

    captureData(...args) {
        //toCapture = args;
    }

    start() {
        simulationChain = this.simulation;
        this.hasSimulation = true;
    }

    resetSimulation() {
        simulationChain = new ScratchSimulationEvent((resolve, reject) => {
            resolve();
        }, 0);
        this.hasSimulation = false;
        this.simulation = new ScratchSimulationEvent((resolve, reject) => {
            resolve();
        }, 0);
    }

    async clickGreenFlag() {
        createProfiler();
        greenFlag();
        await Scratch.executionEnd.promise;
        if (this.hasSimulation) {
            await Scratch.simulationEnd.promise;
            this.resetSimulation();
        }
        this.fill({log: logData, spritesLog: log, vm: {}});
    }

}

const scratch = new ScratchJudge();
let actionTimeout = 5000;

async function runTests() {
    //wait until Scratch project is fully loaded.
    await Scratch.loadedEnd.promise;
    //Execute the prepare function from the evaluation file to create events
    prepare();

    dodona.startTestTab('Resultaat');

    //Execute the scratch project
    dodona.startTestContext();
    await scratch.clickGreenFlag();
    dodona.closeTestContext();

    //Create new test context for tests after the execution
    dodona.startTestContext();
    evaluate();
    dodona.closeTestContext();

    dodona.closeTestTab();

    return true;
}
