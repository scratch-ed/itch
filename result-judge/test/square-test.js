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
const test = require('tap').test;
const path = require('path');
const chromeless = new Chromeless();
const indexHTML = path.resolve(__dirname, '../index.html');
const testDir = (...args) => path.resolve(__dirname, '../scratch_code', ...args);
var testFunctions = require("./test-functions.js");

const runFile = (file) =>
    // start each test by going to the index.html, and loading the scratch file
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


// Async function which runs the tests
async function runTests ()  {
    await test('isSquare', async t => {
        const logData = await runFile(process.argv[2]);

        //Replace these tests by a file containing tests
        t.ok(testFunctions.detectSquare(logData), "The figure is a square");

        const blue = [0,0,1,1];
        t.same(testFunctions.detectColor(logData), blue, "The figure is blue");

        t.end();

    });

    // close the browser window we used
    //await chromeless.end();
}

runTests();
