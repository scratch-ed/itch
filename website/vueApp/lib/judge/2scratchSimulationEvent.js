class ScratchSimulationEvent extends SimulationEvent {

  clickTarget(target, delay = 0) {

    return this.next(() => {
      console.log(`click ${target}`);
      // fetch the target
      let _target = Scratch.vm.runtime.getSpriteTargetByName(target);

      // simulate mouse click by explicitly triggering click event on
      // the target
      if(target !== 'Stage'){
        Scratch.vm.runtime.startHats('event_whenthisspriteclicked', null, _target);
      }
    }, delay);

  }

  pressKey(key, delay = 0) {

    return this.next(() => {
      console.log(`press ${key}`);
      let data = {key: key, isDown: true};
      Scratch.vm.runtime.ioDevices.keyboard.postData(data);
    }, delay);

  }

  end(delay = 200) {

    return this.next(() => {
      console.log("Finished simulation");
      Scratch.ended.resolve();
      Scratch.simulationEnd.resolve();
      // stop all Scratch processes
      Scratch.vm.stopAll();
    }, delay);

  }

  evaluate(action, delay = 0) {

    // this is just an alias for next (rethink passing environment and observations to action)
    return this.next(action, delay);

  }

}
