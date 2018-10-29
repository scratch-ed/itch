const Scratch = require("./Scratch.js");
const expect = require('chai').expect;

var lines = require("./test_functions/lines.js");

const maxExecutionTime = 10000;
const fileName = '10-triangles.sb3';

// + opvangen corrupt files
//Scratch.loadFile(fileName);

describe('triangle', function() {
    this.timeout(maxExecutionTime);
    let logData;

    before(async function() {
        logData = await Scratch.run(fileName);
    });

    describe('#findTriangles', () => {
        const expectedNumberOfTriangles = 10;

        it(`should find ${expectedNumberOfTriangles} triangles`, async () => {
            expect(lines.findTriangles(logData.lines)).to.equal(expectedNumberOfTriangles);
            // expect(logData.lines.triangles().length).to.equal(expectedNumberOfTriangles);
        })
    });

});
