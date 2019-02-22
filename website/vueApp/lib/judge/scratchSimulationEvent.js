class ScratchSimulationEvent extends SimulationEvent {

  clickTarget(target, delay = 0) {

    return this.next(() => {
      console.log(`click ${target}`);
      // fetch the target
      let _target = Scratch.vm.runtime.getSpriteTargetByName(target);

      // simulate mouse click by explicitly triggering click event on
      // the target
      Scratch.vm.runtime.startHats('event_whenthisspriteclicked', null, _target);

      // debug
      // let _hoofd = Scratch.vm.runtime.getSpriteTargetByName("Hoofd");
      // console.log("Current costume of Hoofd: ",_hoofd.currentCostume);

    }, delay);

  }

  stopSimulation(delay = 0) {

    return this.next(() => {

      console.log('stop Scratch');

      // stop all Scratch processes
      Scratch.vm.stopAll();

      // ???
      process.nextTick(process.exit);

    }, delay);

  }

  evaluate(action, delay = 0) {

    // this is just an alias for next (rethink passing environment and observations to action)
    return this.next(action, delay);

  }

}
