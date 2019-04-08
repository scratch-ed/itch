class ScratchSimulationEvent extends SimulationEvent {

    start() {
        return this.next((resolve, reject) => {
            // Give sprites 500 ms to load
            setTimeout(() => {
                resolve();
            }, 500)
        })
    }

    clickSprite(spriteName, delay = 0) {

        return this.next((resolve, reject) => {
            let startTime = Date.now();
            console.log(`${getTimeStamp()}: click ${spriteName}`);

            dodona.startTestCase(`Klik op sprite: ${spriteName}`);

            // fetch the target
            let _sprite = Scratch.vm.runtime.getSpriteTargetByName(spriteName);

            // save sprites state before click
            let oldFrame = new Frame('click', log.pen);

            // simulate mouse click by explicitly triggering click event on
            // the target
            let list;
            if (spriteName !== 'Stage') {
                list = Scratch.vm.runtime.startHats('event_whenthisspriteclicked', null, _sprite);
            } else {
                resolve();
                return;
            }

            let promiseList = [];
            for (let i = 0; i < list.length; i++) {
                promiseList.push(ensureFinished(list[i].topBlock, actionTimeout))
            }

            let promise = Promise.all(promiseList);

            promise.then(() => {

                let extraWaitTime = 0;
                let timeSpend = Date.now() - startTime;
                if (delay > timeSpend) {
                    extraWaitTime = delay - timeSpend;
                }

                setTimeout(() => {

                    console.log(`finished click on ${spriteName}`);
                    // save sprites state after click
                    let newFrame = new Frame('click', log.pen);
                    log.addEvent({event: 'click', before: oldFrame, after: newFrame});
                    resolve();

                }, extraWaitTime);

            }, (reason) => {
                console.log(`${getTimeStamp()}: ${reason} after ${Date.now() - startTime} ms`);
                Scratch.vm.stopAll();
                Scratch.executionEnd.resolve();
                Scratch.simulationEnd.resolve();

            });

        });

    }

    greenFlag(delay = 0) {
        return this.next((resolve, reject) => {
            let startTime = Date.now();

            let oldFrame = new Frame('greenFlag', log.pen);

            let list = Scratch.vm.greenFlag();



            let promiseList = [];
            for (let i = 0; i < list.length; i++) {
                promiseList.push(ensureFinished(list[i].topBlock, actionTimeout))
            }

            let promise = Promise.all(promiseList);

            promise.then(() => {

                let extraWaitTime = 0;
                let timeSpend = Date.now() - startTime;
                if (delay > timeSpend) {
                    extraWaitTime = delay - timeSpend;
                }

                setTimeout(() => {

                    console.log(`finished greenFlag()`);
                    // save sprites state after click
                    let newFrame = new Frame('greenFlag', log.pen);
                    log.addEvent({event: 'greenFlag', before: oldFrame, after: newFrame});
                    resolve();

                }, extraWaitTime);

            }, (reason) => {
                console.log(`${getTimeStamp()}: ${reason} after ${Date.now() - startTime} ms`);
                Scratch.vm.stopAll();
                Scratch.executionEnd.resolve();
                Scratch.simulationEnd.resolve();

            });
        });
    }

    pressKey(key, delay = 0) {

        return this.next(() => {
            console.log(`press ${key}`);

            dodona.startTestCase(`Druk op toets: ${key}`);

            let data = {key: key, isDown: true};
            Scratch.vm.runtime.ioDevices.keyboard.postData(data);

        });

    }

    isTouchingSprite(spriteName1, spriteName2) {
        let sprite1 = Scratch.vm.runtime.getSpriteTargetByName(spriteName1);
        let sprite2 = Scratch.vm.runtime.getSpriteTargetByName(spriteName2);

        let touching = sprite1.isTouchingSprite(sprite2);
    }

    isTouchingEdge(spriteName) {
        let sprite1 = Scratch.vm.runtime.getSpriteTargetByName(spriteName);

        let touching = sprite1.isTouchingEdge();
    }

    testCostume(spriteName, correctCostumeName, delay = 0) {
        return this.next((resolve, reject) => {

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

            resolve();

        }, delay);
    }

    testXCoordinate(spriteName, correctX, delay = 0) {
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

    testYCoordinate(spriteName, correctY, delay = 0) {
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

    testCoordinates(spriteName, correctCoordinates, delay = 0) {
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
