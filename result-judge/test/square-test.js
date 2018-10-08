/* 
  _________                    __         .__      ___________              __          
 /   _____/ ________________ _/  |_  ____ |  |__   \__    ___/___   _______/  |_  ______
 \_____  \_/ ___\_  __ \__  \\   __\/ ___\|  |  \    |    |_/ __ \ /  ___/\   __\/  ___/
 /        \  \___|  | \// __ \|  | \  \___|   Y  \   |    |\  ___/ \___ \  |  |  \___ \ 
/_______  /\___  >__|  (____  /__|  \___  >___|  /   |____| \___  >____  > |__| /____  >
        \/     \/           \/          \/     \/               \/     \/            \/ 
Visual inspection of scratch projects 
*/
const {Chromeless} = require('chromeless');
const test = require('tap').test;
const path = require('path');
const chromeless = new Chromeless();
const indexHTML = path.resolve(__dirname, '../index.html');
const testDir = (...args) => path.resolve(__dirname, '../scratch_code', ...args);

const runFile = (file, script) =>
    // start each test by going to the index.html, and loading the scratch file
    chromeless.goto(`file://${indexHTML}`)
        .setFileInput('#file', testDir(file))
        // the index.html handler for file input will add a #loaded element when it
        // finishes.
        .wait('#loaded')
        .evaluate(script);

// Code which runs in chrome
function testSquare() {
	return detectSquare();
}

function testRectangle() {
    return true;
}

function testColor() {
    return detectColor();
}

// Async function which runs the tests
async function runTests ()  {
    await test('isSquare', async t => {
        const isSquare = await runFile(process.argv[2],testSquare);
       	t.ok(isSquare,"The figure is a square"); 

        const isRectangle = testRectangle();
        t.ok(isRectangle, "[ALWAYS TRUE] The figure is a rectangle");

        const Sides = 4;
        t.is(4, Sides, "[ALWAYS TRUE] It has four sides");

        const isBlue = await runFile(process.argv[2],testColor);
        const blue = [0,0,1,1];
        t.same(isBlue, blue, "It is blue");

        t.end();
    });
    // close the browser window we used
    //await chromeless.end();
}

runTests();
