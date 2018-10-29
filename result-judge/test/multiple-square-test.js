var Scratch = require("./Scratch.js");
const expect = require('chai').expect;
const scratch = new Scratch();

const maxExecutionTime = 10000;
const fileName = '10-squares.sb3';

scratch.loadFile(fileName);

describe('square', function() {
    this.timeout(maxExecutionTime);

    before(async function() {
        await scratch.run();
    });

    describe('#findSquares', () => {
        const expectedNumberOfSquares = 10;

        it(`should find ${expectedNumberOfSquares} squares`, async () => {
            expect(scratch.lines.squares.length).to.equal(expectedNumberOfSquares);
        })
    });

});
