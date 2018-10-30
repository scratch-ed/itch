var Scratch = require("./Scratch.js");
const expect = require('chai').expect;
const scratch = new Scratch();

const maxTestingTime = 8000;
const executionTime = 2000;
const fileName = 'square.sb3';

scratch.loadFile(fileName);
scratch.executionTime = executionTime;

describe('square', function() {
    this.timeout(maxTestingTime);

    before(async function() {
        await scratch.run();
    });

    describe('#findSquare', () => {
        it(`should find exactly one square`, async () => {
            expect(scratch.lines.squares.length).to.equal(1);
        })
    });

});
