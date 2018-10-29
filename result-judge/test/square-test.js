var Scratch = require("./Scratch.js");
const expect = require('chai').expect;
const scratch = new Scratch();

const maxExecutionTime = 10000;
const fileName = 'square.sb3';

scratch.enableTurbo();
scratch.loadFile(fileName);

describe('square', function() {
    this.timeout(maxExecutionTime);

    before(async function() {
        await scratch.run();
    });

    describe('#findSquare', () => {
        it(`should find exactly one square`, async () => {
            expect(scratch.lines.squares.length).to.equal(1);
        })
    });

});
