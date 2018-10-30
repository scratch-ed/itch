var Scratch = require("./Scratch.js");
const expect = require('chai').expect;
const scratch = new Scratch();

const maxTestingTime = 5000;
const executionTime = 1000;
const fileName = 'triangle.sb3';

scratch.loadFile(fileName);
scratch.executionTime = executionTime;

describe('triangle', function() {
    this.timeout(maxTestingTime);

    before(async function() {
        await scratch.run();
    });

    describe('#findTriangle', () => {
        it(`should find exactly one triangle`, async () => {
            expect(scratch.lines.triangles.length).to.equal(1);
        })
    });

});