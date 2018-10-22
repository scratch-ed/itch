const runCode = require("./runCode.js");
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
        it('should detect a square', async () => {
            expect(lines.detectTriangle(logData)).to.be.true;
        })
    });
});
