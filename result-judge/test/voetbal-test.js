var Scratch = require("./Scratch.js");
const expect = require('chai').expect;
const scratch = new Scratch();

const maxTestingTime = 12000;
const maxExecutionTime = 10000;
const maxExpectedTime = 500;
const fileName = 'voetbal.sb3';

scratch.enableTurbo();
scratch.loadFile(fileName);

describe('Voetbal', function() {
    this.timeout(maxTestingTime); // Gives an error if all the tests together exceed the max testing time
    this.slow(maxExpectedTime); // Gives a warning if a test exceeds the expected time

    before(async function() {
        this.timeout(maxExecutionTime); // Gives an error if the code execution exceeds the max execution time
        // scratch.maxDuration = 10000; // Set max duration on 10 seconds
        await scratch.run();
    });

    describe('#before starting', function() {
        it(`should not show the ball`, async function() {
            //expect(scratch.sprites.findByName('ball').isShown()).to.be.false;
        });
    });

    describe('#during execution', function() {
        it(`should show the ball`, async function() {
            //expect(scratch.sprites.findByName('ball').isShown()).to.be.true;
        });
    });

    describe('#after finishing', function() {
        const expectedNumberOfLines = 8;

        it(`should show ${expectedNumberOfLines} lines`, async function() {
            expect(scratch.lines.mergedLines.length).to.equal(expectedNumberOfLines);
        });

        it(`should show the lines in white`, async function() {
            //expect(scratch.lines.colors).to.deep.equal(white);
        });

        it(`should have unique lines between each soccer player`, async function() {
            expect(scratch.lines.mergedLines.length).to.equal(scratch.lines.length);
        });

        it(`should not show the ball`, async function() {
            //expect(scratch.sprites.findByName('ball').isShown()).to.be.false;
        });
    });

});
