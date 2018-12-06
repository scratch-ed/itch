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
        this.numberOfRun = 0;
        this.chromeless = new Chromeless();
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
        await this._runFile(this._fileName, this.executionTime, this.keyInput, this.mouseInput);
        await this._createProfiler();
    }

    async end() {
        await this.chromeless.end();
    }

    async createProfiler() {
        await this._createProfiler();
    }

    async clickGreenFlag() {
        const data = await this._greenFlag();
        this.fill(data);
    }

    async setInput () {
        await this._setInput(this.keyInput, this.mouseInput);
    }

    //
    // Functions running in Chrome with Chromeless
    //
    async _runFile(fileName, executionTime, keyInput, mouseInput) {
        await this.chromeless.goto(`file://${indexHTML}`);

        await this.chromeless.evaluate((executionTime, keyInput, mouseInput) => {
                this.executionTime = executionTime;
                this.keyInput = keyInput;
                this.mouseInput = mouseInput;
            }, executionTime, keyInput, mouseInput);

        await this.chromeless.setFileInput('#file', testDir(fileName));

        return await this.chromeless.evaluate(() => {
                return Scratch.loaded.promise;
            })
    }

    async _setInput(newKeyInput, newMouseInput) {
        return await this.chromeless.evaluate((newKeyInput, newMouseInput) => {
            console.log("Setting input");
            keyInput = newKeyInput;
            mouseInput = newMouseInput;
            }, newKeyInput, newMouseInput);
    }

    async _createProfiler() {
        return this.chromeless.evaluate(() => {
            createProfiler();
        })
    }

    async _greenFlag() {
        let date = new Date();
        let startTimestamp = date.getTime();

        console.log("1", (new Date()).getTime() - startTimestamp);
        await this.chromeless.evaluate(() => {
            greenFlag();
        });

        console.log("2", (new Date()).getTime() - startTimestamp);
        await this.chromeless.evaluate(() => {
            return Scratch.ended.promise;
        });

        console.log("3", (new Date()).getTime() - startTimestamp);
        return await this.chromeless.evaluate(() => {
            return {log: logData, blocks: blocks, spritesLog: spritesLog, vm: vmData};
        });
    }
};