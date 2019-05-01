

class ScratchJudge {

    constructor() {
        this.eventScheduling = new ScratchSimulationEvent().start();
        this.log = {};
    }

    fill() {
        this.log = log;
    }

    start() {
        simulationChain = this.eventScheduling;
    }

    async startEvents() {
        createProfiler();
        start();
        await Scratch.simulationEnd.promise;
        this.fill();
    }

    checkModifications() {
        // check if the start exercise file was modified

    }

}

const scratch = new ScratchJudge();
let actionTimeout = 5000;

async function runTests() {
    //wait until Scratch project is fully loaded.
    await Scratch.loadedEnd.promise;

    // Check if the given sprites are not modified by the student
    let modified = check();
    if (modified) {
        console.log('--- END OF EVALUATION ---');
        dodona.addMessage('Student modified given start sprites');
        return true;
    }

    //Execute the prepare function from the evaluation file to create events
    prepare();

    dodona.startTestTab('Resultaat');

    //Execute the scratch project
    dodona.startTestContext();
    await scratch.startEvents();
    dodona.closeTestContext();

    //Create new test context for tests after the execution
    dodona.startTestContext();
    evaluate();
    dodona.closeTestContext();

    dodona.closeTestTab();
    console.log('--- END OF EVALUATION ---');
    return true;
}
