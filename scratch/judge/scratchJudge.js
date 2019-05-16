
class ScratchJudge {

    constructor() {
        this.eventScheduling = new ScratchSimulationEvent().start();
        this.log = {};
        this.answers = [];
    }

    fill() {
        this.log = log;
    }

    start() {
        simulationChain = this.eventScheduling;
        answers = [...this.answers];
    }

    async startEvents() {
        createProfiler();
        start();
        await Scratch.simulationEnd.promise;
        this.fill();
    }
}

const scratch = new ScratchJudge();
let actionTimeout = 5000;

async function runTests(templateJSON, testJSON) {

    dodona.startTestTab('Testen voor de uitvoer');
    // Check if the given sprites are not modified by the student
    beforeExecution(JSON.parse(templateJSON), JSON.parse(testJSON));
    dodona.closeTestTab();

    dodona.startTestTab('Testen op de uitvoer');

    //Schedule events and tests executed during execution
    duringExecution();

    //wait until Scratch project is fully loaded to start first event
    await Scratch.loadedEnd.promise;

    //Create a new context for tests during the execution
    dodona.startTestContext();
    //Execute the scratch project
    await scratch.startEvents();
    dodona.closeTestContext();

    //Create a new context for tests after the execution
    dodona.startTestContext();
    //Execute the tests after the Scratch project finished running
    afterExecution();
    dodona.closeTestContext();

    dodona.closeTestTab();
    console.log('--- END OF EVALUATION ---');
    return true;
}
