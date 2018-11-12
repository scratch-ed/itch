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
const spriteFunctions = require("./test_functions/sprites.js");

class Playground {
    constructor(log) {
        this.lines = log.lines;
        this.responses = log.responses;
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
    constructor(spritesLog) {
        this.sprites = spritesLog[spritesLog.length - 1].sprites; //sprites in the final states
        this.log = spritesLog;
    }

    listSprites() {
        return this.data;
    }

    getSpriteIdByName(spriteName) {
        return spriteFunctions.getSpriteIdByName(spriteName, this.sprites);
    }

    getSpriteById(spriteId) {
        return spriteFunctions.getSpriteById(spriteId, this.sprites);
    }

    containsLoop(spriteId) {
        return spriteFunctions.containsLoop(spriteId, this.sprites);
    }

    getStartSprites() {
        return this.log[0].sprites;
    }

    getSpritesAfterFirstBlockOccurance(blockName) {
        return spriteFunctions.getSpritesAfterBlock(blockName, 1, this.log);
    }

    getSpritesBeforeFirstBlockOccurance(blockName) {
        return spriteFunctions.getSpritesBeforeBlock(blockName, 1, this.log);
    }

    getSpritesAfterBlock(blockName, occurance) {
        return spriteFunctions.getSpritesAfterBlock(blockName, occurance, this.log);
    }

    getSpritesBeforeBlock(blockName, occurance) {
        return spriteFunctions.getSpritesBeforeBlock(blockName, occurance, this.log);
    }

    isVisibleAtStart(spriteName) {
        return this.isVisible(spriteName, this.getStartSprites());
    }

    isVisibleAtEnd(spriteName) {
        return this.isVisible(spriteName, this.sprites);
    }

    isVisible(spriteName, sprites) {
        let spriteId = this.getSpriteIdByName(spriteName, sprites);
        return spriteFunctions.isVisible(spriteId, sprites);
    }

    getBlocks(spriteName) {
        let spriteId = this.getSpriteIdByName(spriteName, this.sprites);
        return spriteFunctions.getBlocks(spriteId, this.sprites);
    }


}

module.exports = class Scratch {

    constructor () {
        this.executionTime = 1000; // Default: execute the code for 1 second
        this.keyInput = [];
        this.mouseInput = [];
    }

    fill(data) {
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

    loadFile(fileName) {
        this._fileName = fileName;
    }

    async run() {
        // run file in Scratch vm
        let loaded = await Scratch._runFile(this._fileName, this.executionTime, this.keyInput, this.mouseInput);
        this.isLoaded = loaded;
        let test = await Scratch._setInput(this.keyInput, this.mouseInput);
        console.log(test);
        //await chromeless.end();
        return true;
    }

    async clickGreenFlag() {
        console.log("clickGreenFlag()");
        const data = await Scratch._greenFlag();
        this.fill(data);
        return true;
    }

    async setInput () {
        return await Scratch._setInput(this.keyInput, this.mouseInput);
    }

    //
    // Functions running in Chrome with Chromeless
    //
    static _runFile(fileName, executionTime, keyInput, mouseInput) {
        return chromeless.goto(`file://${indexHTML}`)
            .evaluate((executionTime, keyInput, mouseInput) => {
                this.executionTime = executionTime;
                this.keyInput = keyInput;
                this.mouseInput = mouseInput;
            }, executionTime, keyInput, mouseInput)
            .setFileInput('#file', testDir(fileName))
            // the index.html handler for file input will add a #loaded element when it
            // finishes.
            .wait('#loaded')
            .evaluate(() => {
                return true;
            })
    }

    static _setInput(keyInput, mouseInput) {
        return chromeless.evaluate((keyInput, mouseInput) => {
            console.log("Setting input");
            this.keyInput = keyInput;
            this.mouseInput = mouseInput;
        }, keyInput, mouseInput)
    }

    static _greenFlag() {
        return chromeless.evaluate(() => {
                console.log("Executing greenFlag()");
                startProfilerRun();
            })
            .wait("#ended")
            .evaluate(() => {
                return {log:logData, blocks:blocks, spritesLog: spritesLog, vm:vmData};
            });
    }
};