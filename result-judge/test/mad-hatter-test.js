const Simulation = require("../simulation");
const Scratch = require("./Scratch.js");
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
            //add click events
            /*scratch.simulation = new Simulation();
            const start = scratch.simulation.startEvent;

            start
                //.observeTargets('Hoofd', 'currentCostume')
                .foreach(
                ['Stage', 'Hoofd', 'Hoofd', 'Goblin', 'Hoofd', 'Hoofd', 'Stage', 'Hoofd', 'Hoofd', 'Goblin', 'Hoofd', 'Hoofd', 'Goblin'],
                (index, target, anchor) => {
                    return anchor
                        .clickTarget(target, 1000)
                        //.observeTargets('Hoofd', 'currentCostume', 250);
                }
            );

            console.log(scratch.simulation);
*/
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
