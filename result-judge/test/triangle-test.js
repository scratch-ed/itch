const test = require('tap').test;
var lines = require("./test_functions/lines.js");
var runCode = require("./runCode.js");

async function triangleTest() {
    await test('isTriangle', async t => {
        //run the Scratch code and get the log data
        let logData = await runCode.getLogData();

        //Test if a square is present
        t.ok(lines.detectTriangle(logData), "The figure is a triangle");

        t.end();
        await runCode.closeChrome();
    });
}

triangleTest();