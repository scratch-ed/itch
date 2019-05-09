
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

    // Check if the given sprites are not modified by the student
    let modified = check(JSON.parse(templateJSON), JSON.parse(testJSON));
    if (modified) {
        console.log('--- END OF EVALUATION ---');
        dodona.addMessage('Student modified given start sprites');
        return true;
    }

    //Execute the prepare function from the evaluation file to create events
    prepare();

    //wait until Scratch project is fully loaded to start first event.
    await Scratch.loadedEnd.promise;

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
