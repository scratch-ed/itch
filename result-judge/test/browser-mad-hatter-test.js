
const scratch = new ScratchResult();
let expect = chai.expect;

const maxTestingTime = 20000;
executionTime = 18000;
const fileName = 'mad-hatter.sb3';

describe('Test: Mad hatter oefening', function() {
    this.timeout(maxTestingTime);

    before(async function() {
        await scratch.load();
    });

    describe('Simulatie testen', function() {

        before(async function() {

            //create simulation event chain
            simulationChain
                .foreach(
                    ['Stage', 'Hoofd', 'Hoofd', 'Goblin', 'Hoofd', 'Hoofd', 'Stage', 'Goblin', 'Hoofd', 'Goblin'],
                    (index, target, anchor) => {
                        return anchor
                            .clickTarget(target, 300)
                    }
                )
                .next(()=>{
                    console.log("Finished simulation");
                    Scratch.simulationEnd.resolve();
                },0);

            //run code
            await scratch.clickGreenFlag();
            console.log('before ended');
        });

        describe('#kostuum', () => {
            it(`Na 5 keer op het hoofd te klikken moet het hoofd blauw zijn`, async () => {
                expect(scratch.sprites.getCostume('Hoofd')).to.equal(2);
            })
        });

    });

    describe('Code testen', function() {

        describe('#looks_nextcostume', () => {
            it(`Er wordt gebruikt gemaakt van het blok looks_nextcostume`, async () => {
                expect(scratch.allBlocks.containsBlock('looks_nextcostume')).to.be.true;
            })
        });

    });

});
