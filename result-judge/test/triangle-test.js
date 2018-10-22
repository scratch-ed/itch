const test = require('tap').test;
var testFunctions = require("./test-functions.js");
var runCode = require("./runCode.js");

async function triangleTest() {
    await test('isSquare', async t => {
        //run the Scratch code and get the log data
        let logData = await runCode.getLogData();

        //Test if a square is present
        t.ok(testFunctions.detectTriangle(logData), "The figure is a triangle");

        t.end();
        await runCode.closeChrome();
    });
}

triangleTest();