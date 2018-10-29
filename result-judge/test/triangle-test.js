var Scratch = require("./Scratch.js");
const expect = require('chai').expect;
const scratch = new Scratch();

const maxExecutionTime = 10000;
const fileName = 'triangle.sb3';

scratch.enableTurbo();
scratch.loadFile(fileName);

describe('triangle', function() {
    this.timeout(maxExecutionTime);

    before(async function() {
        await scratch.run();
    });

    describe('#findTriangle', () => {
        it(`should find exactly one triangle`, async () => {
            expect(scratch.lines.triangles.length).to.equal(1);
        })
    });

});
