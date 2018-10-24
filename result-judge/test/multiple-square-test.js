const Scratch = require("./runCode.js");
const expect = require('chai').expect;

var lines = require("./test_functions/lines.js");

const maxExecutionTime = 10000;
const fileName = '10-squares.sb3';

describe('square', function() {
    this.timeout(maxExecutionTime);
    let logData;

    before(async function() {
        logData = await Scratch.run(fileName);
    });

    describe('#findSquares', () => {
        const expectedNumberOfSquares = 10;

        it(`should find ${expectedNumberOfSquares} squares`, async () => {
            expect(lines.findSquares(logData.lines)).to.equal(expectedNumberOfSquares);
            // expect(Scratch.lines.squares().length).to.equal(expectedNumberOfSquares);
        })
    });

});
