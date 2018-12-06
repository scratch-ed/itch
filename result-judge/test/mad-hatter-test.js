var Scratch = require("./Scratch.js");
const expect = require('chai').expect;
const scratch = new Scratch();

const maxTestingTime = 8000;
const executionTime = 4000;
const fileName = 'mad-hatter.sb3';

scratch.loadFile(fileName);
scratch.executionTime = executionTime;

describe('mad hatter', function() {
    this.timeout(maxTestingTime);

    before(async function() {
        await scratch.run();
    });

    describe('testOnResult', function() {

        before(async function() {
            await scratch.clickGreenFlag();
        });

        describe('#findSquare', () => {
            it(`costume should be nr 1 at finish`, async () => {
                expect(scratch.sprites.getCostume('Sprite1')).to.equal(2);
            })
        });

    });

});
