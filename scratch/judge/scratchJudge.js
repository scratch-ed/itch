/* Copyright (C) 2019 Ghent University - All Rights Reserved */

/**
 * @typedef {Object} ProjectJson
 * @property {list} extensions - A list of used extension.
 * @property {list} monitors - A list of used monitors.
 * @property {Object} metadata - Some information about the project.
 * @property {list} targets - A list of used targets in the project.
 */

/**
 * @callback BeforeExecution
 * @param {ProjectJson} templateJSON - The JSON from the starting template of the project.
 * @param {ProjectJson} testJSON - The JSON from the submitted template of the project.
 * 
 * @callback DuringExecution
 * 
 * @callback AfterExecution
 * 
 * @typedef {Object} Testplan
 * @property {BeforeExecution} Called before the project has been executed, to allow static tests.
 * @property {DuringExecution} Called during project execution, to allow scheduling events.
 * @property {AfterExecution} Called after execution has been completed, to allow post-mortem tests.
 */

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

    /**
     * Run the tests for 
     * @param templateJson
     * @param testJson
     * @returns {Promise<void>}
     */
    async runTests(testplan) {
        
    }
}

const scratch = new ScratchJudge();
let actionTimeout = 5000;
let speed = 1;

async function runTests(templateJSON, testJSON) {
    
    
    

    dodona.startTestTab('Testen uit het testplan');
    dodona.startTestContext();
    // Check if the given sprites are not modified by the student
    beforeExecution(JSON.parse(templateJSON), JSON.parse(testJSON));
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
