var Scratch = require("../../ScratchResult.js");
const expect = require('chai').expect;
const scratch = new Scratch();

const maxTestingTime = 20000;
const maxExecutionTime = 15000;
const maxExpectedTime = 2000;
const fileName = 'voetbal.sb3';

scratch.executionTime = 8000;
scratch.loadFile(fileName);

describe('Voetbal', function() {
    this.timeout(maxTestingTime); // Gives an error if all the tests together exceed the max testing time
    this.slow(maxExpectedTime); // Gives a warning if a test exceeds the expected time

    before(async function() {
        this.timeout(maxExecutionTime); // Gives an error if the code execution exceeds the max execution time
        // scratch.maxDuration = 10000; // Set max duration on 10 seconds
        await scratch.run();
    });

    describe('testOnResult', function() {

        describe('#before starting', function() {
            it(`should not show the ball at the start`, async function() {
                expect(scratch.sprites.isVisibleAtStart('ball')).to.be.false;
            });
        });

        describe('#during execution', function() {
            it(`should show the ball just before moving`, async function() {
                let sprites = scratch.sprites.getSpritesBeforeFirstBlockOccurance('motion_goto');
                expect(scratch.sprites.isVisible('ball', sprites)).to.be.true;
            });
        });

        describe('#after finishing', function() {
            const expectedNumberOfLines = 8;

            it(`should show ${expectedNumberOfLines} lines`, async function() {
                expect(scratch.playground.mergedLines.length).to.equal(expectedNumberOfLines);
            });

            it(`should show the lines in white`, async function() {
                //expect(scratch.lines.colors).to.deep.equal(white);
            });

            it(`should have unique lines between each soccer player`, async function() {
                expect(scratch.playground.mergedLines.length).to.equal(scratch.playground.lines.length);
            });

            it(`should not show the ball at the end`, async function() {
                expect(scratch.sprites.isVisibleAtEnd('ball')).to.be.false;
            });
        });

    });

    describe('testOnCode', function() {

        describe('#usesPen', () => {
            it(`should contain a penDown block`, async () => {
                expect(scratch.allBlocks.containsBlock('pen_penDown')).to.be.true;
            });

            it(`should contain a block to change the pen's color to white`, async () => {
                expect(scratch.allBlocks.containsBlock('pen_setPenColorParamTo')).to.be.true;
            });
        });

        describe('#usesWaitBlock', () => {
            it(`executes at least 7 wait blocks`, async () => {
                expect(scratch.allBlocks.numberOfExecutions('control_wait')).to.be.above(6);
            });
        });

    });
});
