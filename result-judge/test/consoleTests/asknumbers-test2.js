var Scratch = require("../../ScratchResult.js");
const expect = require('chai').expect;
const scratch = new Scratch();

const maxTestingTime = 7000;
const executionTime = 2000;
const fileName = 'asknumbers.sb3';

scratch.loadFile(fileName);
scratch.executionTime = executionTime;

describe('AskNumbers', function() {
    this.timeout(maxTestingTime);

    const input = ["1", "2", "10", "20", "100", "200", "1000", "2000", "10000", "20000"];

    let date = new Date();
    let startTimestamp = date.getTime();

    before(async function() {
        await scratch.run();
        scratch.keyInput = input;
        await scratch.setInput();
    });

    describe('testOnResult', function() {

        describe('#calculatesSum', () => {

            beforeEach(async function() {
                console.log("s", (new Date()).getTime() - startTimestamp);
                await scratch.clickGreenFlag();
                console.log("e", (new Date()).getTime() - startTimestamp);
            });

            for (let i = 0; i < input.length; i+=2) {
                it(`should give the sum of ${input[i]} and ${input[i+1]}`, async () => {
                    let sum = parseInt(scratch.keyInput[i]) + parseInt(scratch.keyInput[i+1]);
                    expect(scratch.playground.say).to.contain(sum.toString());
                })
            }
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
