const Scratch = require("../../ScratchResult.js");
const expect = require('chai').expect;
const scratch = new Scratch();

const maxTestingTime = 20000;
const executionTime = 18000;
const fileName = 'mad-hatter.sb3';

scratch.loadFile(fileName);
scratch.executionTime = executionTime;

describe('mad hatter', function() {
    this.timeout(maxTestingTime);

    before(async function() {
        await scratch.run();
    });

    describe('testOnResult', function() {

        before(async function() {

            await scratch.chromeless.evaluate(() => {
                simulationChain = new ScratchSimulationEvent(() => {}, 0);
                simulationChain
                    .foreach(
                        ['Stage', 'Hoofd', 'Hoofd', 'Goblin', 'Hoofd', 'Hoofd', 'Stage', 'Goblin', 'Hoofd', 'Goblin'],
                        (index, target, anchor) => {
                            return anchor
                                .clickTarget(target, 1000)
                        }
                    )
                    .next(()=>{
                        console.log("Finished simulation");
                        Scratch.simulationEnd.resolve();
                    },0);
            });

            await scratch.setInput();
            await scratch.clickGreenFlag();
        });

        describe('#checkCostume', () => {
            it(`costume should be nr2 at finish`, async () => {
                expect(scratch.sprites.getCostume('Hoofd')).to.equal(2);
            })
        });

    });

});
