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
var lineFunctions = require("./test_functions/lines.js");

const runFile = (fileName) =>
    // start each test by going to the index.html, and loading the scratch file
    console.log('10-squares.sb3');
    chromeless.goto(`file://${indexHTML}`)
        .setFileInput('#file', testDir('10-squares.sb3'))
        // the index.html handler for file input will add a #loaded element when it
        // finishes.
        .wait('#loaded')
        .evaluate(startTests);
//Code which runs in chrome
//Returns the log after running the code
function startTests() {
    return getLog();
}

async function getLogData (fileName)  {
    return runFile(fileName);
}

class Lines {

    constructor(lineData) {
        this.lines = lineData;
        this._squares = lineFunctions.findSquares(this.lines);
    }

    get squares() {
        console.log("returning squares");
        return this._squares;
    }

}

module.exports = class Scratch {

    fill(logData) {
        this.log = logData;
        this.lines = new Lines(logData.lines);
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

    loadFile(fileName) {
        this._fileName = fileName;
    }

    async run() {
        console.log(this._fileName);
        const log = getLogData(this._fileName);
        await chromeless.end();
        this.fill(log);
        return true;
    }

};


/// EXPORTS ///
/*
exports.loadFile = loadFile;
exports.run = run;
exports.Scratch = Scratch;
*/
//exports.Scratch = Scratch;