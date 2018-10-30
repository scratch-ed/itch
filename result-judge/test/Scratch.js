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

class Lines {

    constructor(lineData) {
        this.lines = lineData;
    }

    get () {
        return this._lines;
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

module.exports = class Scratch {

    constructor () {
        this.executionTime = 1000; // Default: execute the code for 1 second
    }

    fill(data) {
        this.log = data.log;
        this.lines = new Lines(data.log.lines);
        this.blocks = data.blocks;
    }

    get blocks() {
        return this._blocks;
    }

    set blocks(value) {
        this._blocks = value;
    }

    get log() {
        return this._log;
    }

    set log(value) {
        this._log = value;
    }

    get lines() {
        return this._lines;
    }

    set lines(value) {
        this._lines = value;
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
            .type(executionTime.toString(), '#executionTime')
            .setFileInput('#file', testDir(fileName))
            // the index.html handler for file input will add a #loaded element when it
            // finishes.
            .wait('#loaded')
            .evaluate(() => {
                return {log:logData, blocks:blocks};
            });
    }
};