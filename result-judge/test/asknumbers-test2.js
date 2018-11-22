var Scratch = require("./Scratch.js");
const expect = require('chai').expect;
const scratch = new Scratch();

const maxTestingTime = 18000;
const executionTime = 5000;
const fileName = 'asknumbers.sb3';

scratch.loadFile(fileName);
scratch.executionTime = executionTime;

describe('AskNumbers', function() {
    this.timeout(maxTestingTime);

    before(async function() {
        //await scratch.run();
    });

    describe('testOnResult', function() {

        describe('#calculatesSum1', () => {

            let input = ["120", "33", "2", "3", "1", "1"];

            it(`should give the sum of two input numbers:`, async () => {
                for (let i = 0; i < input.length; i+=2) {
                    scratch.keyInput = [input[i], input[i+1]];
                    await scratch.run();
                    await scratch.setInput();
                    await scratch.clickGreenFlag();

                    let sum = parseInt(input[i]) + parseInt(input[i+1]);
                    expect(scratch.playground.responses).to.contain(sum.toString());
                }
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
