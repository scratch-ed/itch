class ScratchSimulationEvent extends SimulationEvent {

    clickSprite(spriteName, delay = 0) {

        return this.next(() => {
            console.log(`click ${spriteName}`);

            dodona.startTestCase(`Klik op sprite: ${spriteName}`);

            // fetch the target
            let _sprite = Scratch.vm.runtime.getSpriteTargetByName(spriteName);

            // simulate mouse click by explicitly triggering click event on
            // the target
            if (spriteName !== 'Stage') {
                Scratch.vm.runtime.startHats('event_whenthisspriteclicked', null, _sprite);
            }
        }, delay);

    }

    pressKey(key, delay = 0) {

        return this.next(() => {
            console.log(`press ${key}`);

            dodona.startTestCase(`Druk op toets: ${key}`);

            let data = {key: key, isDown: true};
            Scratch.vm.runtime.ioDevices.keyboard.postData(data);

        }, delay);

    }

    testCostume(spriteName, correctCostumeName, delay = 50) {
        return this.next(() => {

            dodona.startTest(correctCostumeName);

            let status;
            let costumeName = "";

            let _sprite = Scratch.vm.runtime.getSpriteTargetByName(spriteName);
            if (_sprite) {
                let costumeNr = _sprite.currentCostume;
                costumeName = _sprite.sprite.costumes_[costumeNr].name;

                dodona.addMessage(`Sprite: "${spriteName}", Kostuum: "${costumeName}"`);

                if (costumeName === correctCostumeName) {
                    status = {enum: 'correct', human: 'Correct'};
                } else {
                    status = {enum: 'wrong', human: 'Fout'};
                }
            }
            else {
                status = {enum: 'runtime error', human: `Geen kostuum gevonden met als naam: ${spriteName}`};
            }

            dodona.closeTest(costumeName, status);

        }, delay);
    }

    testXCoordinate(spriteName, correctX, delay = 50) {
        return this.next(() => {

            dodona.startTest(correctX);

            let status;
            let x = -1;

            let _sprite = Scratch.vm.runtime.getSpriteTargetByName(spriteName);
            if (_sprite) {
                x = _sprite.x;

                dodona.addMessage(`Sprite: "${spriteName}", x-coordinaat: "${x}"`);

                if (Math.abs(x - correctX) < 0.01) {
                    status = {enum: 'correct', human: 'Correct'};
                } else {
                    status = {enum: 'wrong', human: 'Fout'};
                }
            }
            else {
                status = {enum: 'runtime error', human: `Geen kostuum gevonden met als naam: ${spriteName}`};
            }

            dodona.closeTest(x, status);


        }, delay);
    }

    testYCoordinate(spriteName, correctY, delay = 50) {
        return this.next(() => {
            let _sprite = Scratch.vm.runtime.getSpriteTargetByName(spriteName);
            if (_sprite) {
                let y = _sprite.y;
                if (Math.abs(y - correctY) < 0.01) {
                    console.log('dodona', `Correct: de sprite heeft x-coordinaat: ${correctY}`);
                } else {
                    console.log('dodona', `Fout: de sprite heeft x-coordinaat: ${y}, maar moest x-coordinaat: ${correctY} hebben.`);
                }
            }
            else {
                console.log('error: no sprite found');
            }
        }, delay);
    }

    testCoordinates(spriteName, correctCoordinates, delay = 50) {
        return this.next(() => {
            let _sprite = Scratch.vm.runtime.getSpriteTargetByName(spriteName);
            if (_sprite) {
                let d1 = {x: _sprite.x, y: _sprite.y};
                if (isEqual(d1, correctCoordinates)) {
                    console.log('dodona', `Correct: de sprite heeft coordinaten: (${d1.x}, ${d1.y}`);
                } else {
                    console.log('dodona', `Fout: de sprite heeft coordinaten: (${d1.x}, ${d1.y}, maar moest coordinaten: (${correctCoordinates.x}, ${correctCoordinates.y}) hebben.`);
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
