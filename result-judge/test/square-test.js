const runCode = require("./runCode.js");
const expect = require('chai').expect;

var lines = require("./test_functions/lines.js");
var colors = require("./test_functions/colors.js");

const maxExecutionTime = 10000;
const fileName = 'square-segments-turned.sb3';

describe('square', function() {
    this.timeout(maxExecutionTime);
    let logData;

    before(async function() {
        logData = await runCode.getLogData(fileName);
        return logData;
    });

    describe('#findSquare', () => {
        it('should detect a square', async () => {
            expect(testFunctions.detectSquare(logData)).to.be.true;
        })
    });

    describe('#checkColor', () => {
        it('should be drawn in blue', async () => {
            const blue = [0,0,1,1];
            expect(testFunctions.detectColor(logData)).to.deep.equal(blue);
        })
    });
});
