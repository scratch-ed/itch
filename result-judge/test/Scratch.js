/*
  _________                    __         .__      ___________              __
 /   _____/ ________________ _/  |_  ____ |  |__   \__    ___/___   _______/  |_  ______
 \_____  \_/ ___\_  __ \__  \\   __\/ ___\|  |  \    |    |_/ __ \ /  ___/\   __\/  ___/
 /        \  \___|  | \// __ \|  | \  \___|   Y  \   |    |\  ___/ \___ \  |  |  \___ \
/_______  /\___  >__|  (____  /__|  \___  >___|  /   |____| \___  >____  > |__| /____  >
        \/     \/           \/          \/     \/               \/     \/            \/
Result inspection of scratch projects
*/
const {Chromeless} = require('chromeless');
const path = require('path');
const chromeless = new Chromeless();
const indexHTML = path.resolve(__dirname, '../index.html');
const testDir = (...args) => path.resolve(__dirname, '../scratch_code', ...args);

//test functions imports
const lineFunctions = require("./test_functions/lines.js");
const blockFunctions = require("./test_functions/blocks.js");

class Playground {
    constructor(log) {
        this.lines = log.lines;
    }

    get lines() {
        return this._lines;
    }

    set lines(value) {
        this._lines = value;
    }

    get squares() {
        return lineFunctions.findSquares(this.lines);
    }

    get triangles() {
        return lineFunctions.findTriangles(this.lines);
    }

    get mergedLines() {
        return lineFunctions.mergeLines(this.lines);
    }
}

class AllBlocks {
    constructor(blocks) {
        //console.log(blocks);
        this.blocks = blocks;
    }

    get blocks() {
        return this._blocks;
    }

    set blocks(value) {
        this._blocks = value;
    }

    containsLoop() {
        return blockFunctions.containsLoop(this.blocks);
    }

    containsBlock(blockName) {
        return blockFunctions.containsBlock(blockName, this.blocks);
    }

    numberOfExecutions(blockName) {
        return blockFunctions.countExecutions(blockName, this.blocks);
    }
}

class Vm {
    constructor(vm) {
        //console.log(data);
        this.vm = vm;
    }
}

class Sprites {
    constructor(sprites) {
        //console.log(sprites);
        this.data = sprites;
    }

    listSprites() {
        return this.data;
    }

    getSpriteByName(name) {
        return spriteFunctions.getSpriteByName(name, this.data);
    }

    getSpriteById(id) {
        return spriteFunctions.getSpriteById(id, this.data);
    }

    containsLoop(sprite) {
        return spriteFunctions.containsLoop(sprite, this.data);
    }

}

module.exports = class Scratch {

    constructor () {
        this.executionTime = 1000; // Default: execute the code for 1 second
    }

    fill(data) {
        this.log = data.log;
        this.playground = new Playground(data.log);
        this.allBlocks = new AllBlocks(data.blocks);
        //this.vm = new Vm(data.vm);
        this.sprites = new Sprites(data.sprites);

    }

    get executionTime() {
        return this._executionTime;
    }

    set executionTime(value) {
        this._executionTime = value;
    }

    loadFile(fileName) {
        this._fileName = fileName;
    }

    async run() {
        // run file in Scratch vm
        const data = await Scratch.runFile(this._fileName, this.executionTime);
        this.fill(data);
        //await chromeless.end();
        return true;
    }

    //
    // Functions running in Chrome with Chromeless
    //
    static runFile(fileName, executionTime) {
        return chromeless.goto(`file://${indexHTML}`)
            .evaluate((executionTime) => {
                this.executionTime = executionTime;
            }, executionTime)
            .setFileInput('#file', testDir(fileName))
            // the index.html handler for file input will add a #loaded element when it
            // finishes.
            .wait('#loaded')
            .evaluate(() => {
                return {log:logData, blocks:blocks, sprites:sprites, vm:vmData};
            });
    }
};