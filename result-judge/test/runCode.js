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

const runFile = (file) =>
    // start each test by going to the index.html, and loading the scratch file
    //console.log("running file");
    chromeless.goto(`file://${indexHTML}`)
        .setFileInput('#file', testDir(file))
        // the index.html handler for file input will add a #loaded element when it
        // finishes.
        .wait('#loaded')
        .evaluate(startTests);

//Code which runs in chrome
//Returns the log after running the code
function startTests() {
    return getLog();
}

async function closeChrome(){
    //close the browser window we used
    await chromeless.end();
}

// Async function which get the log data
// Name of scratch code file as argument
async function run (fileName)  {
    const log = runFile(fileName);
    //await chromeless.end();
    return log;
}

exports.closeChrome = closeChrome;
exports.run = run;
