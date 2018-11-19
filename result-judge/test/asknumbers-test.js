var Scratch = require("./Scratch.js");
const expect = require('chai').expect;
const scratch = new Scratch();

const maxTestingTime = 7000;
const executionTime = 2000;
const fileName = 'asknumbers.sb3';

scratch.loadFile(fileName);
scratch.executionTime = executionTime;

describe('AskNumbers', function() {
    this.timeout(maxTestingTime);

    before(async function() {
        await scratch.run();
    });

    describe('testOnResult', function() {

        describe('#calculatesSum1', () => {

            before(async function() {
                scratch.keyInput = ["120", "33"];
                await scratch.setInput();
                console.log("clicking green flag");
                await scratch.clickGreenFlag();
            });

            it(`should give the sum of two input numbers:`, async () => {
                let sum = parseInt(scratch.keyInput[0]) + parseInt(scratch.keyInput[1]);
                expect(scratch.playground.responses).to.contain(sum.toString());
            })
        });

        describe('#calculatesSum2', () => {

            before(async function() {
                scratch.keyInput = ["10", "20"];
                await scratch.setInput();
                await scratch.clickGreenFlag();
            });

            it(`should give the sum of the two input numbers`, async () => {
                let sum = parseInt(scratch.keyInput[0]) + parseInt(scratch.keyInput[1]);
                console.log(scratch.playground.responses);
                expect(scratch.playground.responses).to.contain(sum.toString());
            })
        });

    });

    describe('testOnCode', function() {

        describe('#usesAsk', () => {
            it(`should use the Ask block`, async () => {
                expect(scratch.allBlocks.containsBlock('sensing_askandwait')).to.be.true;
            })
        });

        describe('#usesSay', () => {
            it(`should use the Say block`, async () => {
                expect(scratch.allBlocks.containsBlock('looks_say')).to.be.true;
            })
        });

        describe('#usesSay', () => {
            it(`should use the Operator Add block`, async () => {
                expect(scratch.allBlocks.containsBlock('operator_add')).to.be.true;
            })
        });


    });




});
