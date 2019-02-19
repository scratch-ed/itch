var Scratch = require("../../ScratchResult.js");
const expect = require('chai').expect;
const scratch = new Scratch();

const maxTestingTime = 10000;
const fileName = '10-triangles.sb3';

scratch.loadFile(fileName);
scratch.executionTime = 1000;

describe('triangle', function() {
    this.timeout(maxTestingTime);

    before(async function() {
        await scratch.run();
    });

    describe('#findTriangles', () => {
        const expectedNumberOfTriangles = 10;

        it(`should find ${expectedNumberOfTriangles} triangles`, async () => {
            expect(scratch.playground.triangles.length).to.equal(expectedNumberOfTriangles);
        })
    });

});
