const runCode = require("./Scratch.js");
const expect = require('chai').expect;

var lines = require("./test_functions/lines.js");

const maxExecutionTime = 10000;
const fileName = 'triangle.sb3';

describe('triangle', function() {
    this.timeout(maxExecutionTime);
    let logData;

    before(async function() {
        logData = await runCode.getLogData(fileName);
        await runCode.closeChrome();
        return logData;
    });

    describe('#findTriangle', () => {
        it('should detect a triangle', async () => {
            expect(lines.findOneTriangle(logData)).to.be.true;
        })
    });
});
