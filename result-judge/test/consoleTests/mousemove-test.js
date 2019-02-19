var Scratch = require("../../ScratchResult.js");
const expect = require('chai').expect;
const scratch = new Scratch();

const maxTestingTime = 8000;
const executionTime = 2000;
const fileName = 'mouseMove.sb3';

scratch.loadFile(fileName);
scratch.executionTime = executionTime;

describe('mouseDistance', function() {
    this.timeout(maxTestingTime);

    before(async function() {
        await scratch.run();
    });

    describe('testOnResult', function() {

        describe('#sayGivesNumber', () => {
            it(`should give the distance to the mouse pointer`, async () => {
                //expect(scratch.playground.squares.length).to.equal(1);
            })
        });

    });

    describe('testOnCode', function() {

        describe('#usesSay', () => {
            it(`should use the Say block`, async () => {
                expect(scratch.allBlocks.containsBlock('looks_say')).to.be.true;
            })
        });

    });




});
