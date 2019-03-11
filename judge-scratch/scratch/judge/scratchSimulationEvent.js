class ScratchSimulationEvent extends SimulationEvent {

  clickSprite(spriteName, delay = 0) {

    return this.next(() => {
      console.log(`click ${spriteName}`);
      // fetch the target
      let _sprite = Scratch.vm.runtime.getSpriteTargetByName(spriteName);

      // simulate mouse click by explicitly triggering click event on
      // the target
      if(spriteName !== 'Stage'){
        Scratch.vm.runtime.startHats('event_whenthisspriteclicked', null, _sprite);
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

  testCostume(spriteName, correctCostumeName, delay = 50) {
      return this.next(() => {
          let _sprite = Scratch.vm.runtime.getSpriteTargetByName(spriteName);
          if (_sprite) {
              let costumeNr = _sprite.currentCostume;
              let costumeName = _sprite.sprite.costumes_[costumeNr].name;

              if (costumeName === correctCostumeName) {
                  console.log('dodona', `Correct: de sprite heeft het kostuum: ${costumeName}`);
              } else {
                  console.log('dodona', `Fout: de sprite heeft het kostuum: ${costumeName}, maar moest het kostuum: ${correctCostumeName} hebben.`);
              }
          }
          else {
            console.log('error: no sprite found');
          }

      }, delay);
  }

  end(delay = 200) {

    return this.next(() => {
      console.log("Finished simulation");
      // stop all Scratch processes
      Scratch.vm.stopAll();

      Scratch.executionEnd.resolve();
      Scratch.simulationEnd.resolve();

    }, delay);

  }

  evaluate(action, delay = 0) {

    // this is just an alias for next (rethink passing environment and observations to action)
    return this.next(action, delay);

  }

}
