const runCode = require("./runCode.js");
const expect = require('chai').expect;

var lines = require("./test_functions/lines.js");

const maxExecutionTime = 10000;
const fileName = '10-squares.sb3';

// Extra variables
const numberOfSquares = 10;

describe('square', function() {
    this.timeout(maxExecutionTime);
    let logData;

    before(async function() {
        logData = await runCode.getLogData(fileName);
        await runCode.closeChrome();
        return logData;
    });

    describe('#findSquares', () => {
        it('should find '+numberOfSquares+' squares', async () => {
            expect(lines.findSquares(logData)).to.equal(numberOfSquares);
        })
    });

});
