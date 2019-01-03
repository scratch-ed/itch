
const ScratchSimulationEvent = require("./scratchSimulationEvent");

module.exports = class Simulation {

    constructor() {
        this.startEvent = new ScratchSimulationEvent(() => {}, 0);
    }

    run() {
        this.startEvent.launch();
    }

};