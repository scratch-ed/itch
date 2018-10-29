var Scratch = require("./Scratch.js");
const expect = require('chai').expect;

let scratch = new Scratch();

const maxExecutionTime = 10000;
const fileName = '10-squares.sb3';



describe('square', function() {
    this.timeout(maxExecutionTime);

    before(async function() {
        console.log("loading file");
        scratch.loadFile(fileName);
        console.log("running code");
        return await scratch.run();
    });

    describe('#findSquares', () => {
        const expectedNumberOfSquares = 10;

        it(`should find ${expectedNumberOfSquares} squares`, async () => {
            console.log(scratch.lines);
            expect(scratch.lines.squares.length).to.equal(expectedNumberOfSquares);
        })
    });

});
