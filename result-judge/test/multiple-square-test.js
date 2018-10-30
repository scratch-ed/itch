var Scratch = require("./Scratch.js");
const expect = require('chai').expect;
const scratch = new Scratch();

const maxTestingTime = 12000;
const maxExecutionTime = 10000;
const maxExpectedTime = 500;
const executionTime = 2000;
const fileName = '10-squares.sb3';

scratch.loadFile(fileName);
scratch.executionTime = executionTime;

describe('square', function() {
    this.timeout(maxTestingTime); // Gives an error if all the tests together exceed the max testing time
    this.slow(maxExpectedTime); // Gives a warning if a test exceeds the expected time

    before(async function() {
        this.timeout(maxExecutionTime); // Gives an error if the code execution exceeds the max execution time
        // scratch.maxDuration = 10000; // Set max duration on 10 seconds
        await scratch.run();
    });

    describe('#findSquares', () => {
        const expectedNumberOfSquares = 10;

        it(`should find ${expectedNumberOfSquares} squares`, async () => {
            expect(scratch.lines.squares.length).to.equal(expectedNumberOfSquares);
        })
    });

});
