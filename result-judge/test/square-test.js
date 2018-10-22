const assert = require('assert');
const testFunctions = require("./test-functions.js");
const runCode = require("./runCode.js");
const expect = require('chai').expect;

const maxExecutionTime = 10000;


describe('square', function() {
    this.timeout(maxExecutionTime);
    let logData;

    before(async function() {
        logData = await runCode.getLogData();
    });

    describe('#find', () => {
        it('should find data', async () => {
            console.log(expect(logData));
        });
    });

    describe('#findSquare', () => {
        it('should detect a square', async () => {
            testFunctions.detectSquare(expect(logData));
        })
    });
});

