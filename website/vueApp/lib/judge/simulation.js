class Simulation {

  constructor(simulationChain) {
    this.startEvent = simulationChain;
  }

  run() {
    this.startEvent.launch();
  }

}
