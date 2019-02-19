var Scratch = require("./Scratch.js");
const expect = require('chai').expect;
const scratch = new Scratch();

const maxTestingTime = 8000;
const executionTime = 2000;
const fileName = 'squareOefFout.sb3';

scratch.loadFile(fileName);
scratch.executionTime = executionTime;

describe('square', function() {
    this.timeout(maxTestingTime);

    before(async function() {
        await scratch.run();
    });

    describe('testOnResult', function() {

        before(async function() {
            await scratch.clickGreenFlag();
        });

        describe('#findSquare', () => {
            it(`should find exactly one square`, async () => {
                expect(scratch.playground.squares.length).to.equal(1);
            })
        });

    });

    describe('testOnCode', function() {

        describe('#usesLoop', () => {
            it(`should be coded by using a loop`, async () => {
                expect(scratch.allBlocks.containsLoop()).to.be.true;
            })
        });

        describe('#repeatedCode', () => {
            it(`should repeat the code in the loop at least twice`, async () => {
                expect(scratch.allBlocks.numberOfExecutions('control_repeat')).to.be.above(2);
            })
        });

        describe('#usesPenDown', () => {
            it(`should contain a penDown block`, async () => {
                expect(scratch.allBlocks.containsBlock('pen_penDown')).to.be.true;
            })
        });

    });




});
