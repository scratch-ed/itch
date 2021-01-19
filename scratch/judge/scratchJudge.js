/* Copyright (C) 2019 Ghent University - All Rights Reserved */

/**
 * Entry point for the test plan API.
 * 
 * When writing tests, you should limit interaction with Scratch and
 * the judge to this class, if at all possible.
 * 
 * 
 */
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
let speed = 1;

async function runTests(templateJSON, testJSON) {
    
    
    

    dodona.startTestTab('Testen uit het testplan');
    dodona.startTestContext();
    // Check if the given sprites are not modified by the student
    const templateJson = JSON.parse(templateJSON);
    const submissionJson = JSON.parse(testJSON);
    beforeExecution(new Project(templateJson), new Project(submissionJson));
    dodona.closeTestContext();

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
