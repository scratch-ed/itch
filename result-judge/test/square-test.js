var assert = require('assert');
var testFunctions = require("./test-functions.js");
var runCode = require("./runCode.js");


describe("Tests for exercise: Square", function() {

    let logData;
    console.log("starting tests");

    before(async function(done) {
        logData = await runCode.getLogData();
        console.log("finished getting logData");
        console.log(logData);
        done();
    });

    it('should detect a square', testFunctions.detectSquare(logData));

    it('should be drawn in blue', () => {
        const blue = [0,0,1,1];
        testFunctions.detectColor(logData).should.equal(blue);
    });

    it('should be executed in less than 10 seconds', async () => {
            // should set the timeout of this test to 1000 ms; instead will fail
            this.timeout(10000);
            logData = await runCode.getLogData();
    });

});
