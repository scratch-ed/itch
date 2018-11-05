var Scratch = require("./Scratch.js");
const expect = require('chai').expect;
const scratch = new Scratch();

const maxTestingTime = 18000;
const executionTime = 10000;
const fileName = 'asknumbers.sb3';

scratch.loadFile(fileName);
scratch.executionTime = executionTime;

describe('AskNumbers', function() {
    this.timeout(maxTestingTime);

    before(async function() {
        scratch.input = ["1", "3"];
        await scratch.run();
    });

    describe('testOnResult', function() {

        describe('#calculatesSum', () => {
            it(`should give the sum of the two input numbers`, async () => {
                //expect(scratch.playground.squares.length).to.equal(1);
            })
        });

    });

    describe('testOnCode', function() {

        describe('#usesAsk', () => {
            it(`should use the Ask block`, async () => {
                expect(scratch.allBlocks.containsBlock('sensing_askandwait')).to.be.true;
            })
        });

        describe('#usesSay', () => {
            it(`should use the Ask block`, async () => {
                expect(scratch.allBlocks.containsBlock('looks_say')).to.be.true;
            })
        });

    });




});
