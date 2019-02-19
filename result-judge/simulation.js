

class Simulation {

    constructor(Scratch) {
        this.startEvent = new ScratchSimulationEvent(() => {}, 0);
    }

    run() {
        this.startEvent.launch();
    }

}