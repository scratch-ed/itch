var Scratch = require("./Scratch.js");
const expect = require('chai').expect;
const scratch = new Scratch();

const maxExecutionTime = 10000;
const fileName = '10-triangles.sb3';

scratch.enableTurbo();
scratch.loadFile(fileName);

describe('triangle', function() {
    this.timeout(maxExecutionTime);

    before(async function() {
        await scratch.run();
    });

    describe('#findTriangles', () => {
        const expectedNumberOfTriangles = 10;

        it(`should find ${expectedNumberOfTriangles} triangles`, async () => {
            expect(scratch.lines.triangles.length).to.equal(expectedNumberOfTriangles);
        })
    });

});
