const test = require('tap').test;
var testFunctions = require("./test-functions.js");
var runCode = require("./runCode.js");

async function squareTest() {
    await test('isSquare', async t => {
        //run the Scratch code and get the log data
        let logData = await runCode.getLogData();

        //Test if a square is present
        t.ok(testFunctions.detectSquare(logData), "The figure is a square");

        //Test if everything is drawn in blue
        const blue = [0,0,1,1];
        t.same(testFunctions.detectColor(logData), blue, "The figure is blue");

        t.end();
        await runCode.closeChrome();
    });
}

squareTest();