class ScratchSimulationEvent extends SimulationEvent {

    start() {
        return this.next((resolve, reject) => {
            // Give sprites 500 ms to load
            setTimeout(() => {
                resolve();
            }, 300)
        })
    }

    clickSprite(data = {}) {

        return this.next((resolve, reject) => {

            let spriteName = data.spriteName || 'Stage';
            let delay = data.delay || 0;
            let timeout = data.timeout || actionTimeout;
            let sync = data.sync;
            if (sync === undefined) sync = true;

            let startTime = Date.now();
            console.log(`${getTimeStamp()}: click ${spriteName}`);

            dodona.startTestCase(`Klik op sprite: ${spriteName}`);

            // fetch the target
            let _sprite = Scratch.vm.runtime.getSpriteTargetByName(spriteName);

            // save sprites state before click
            let event = new Event('click', {target: spriteName});
            event.previousFrame = new Frame('click');
            log.addEvent(event);

            // simulate mouse click by explicitly triggering click event on
            // the target
            let list;
            if (spriteName !== 'Stage') {
                list = Scratch.vm.runtime.startHats('event_whenthisspriteclicked', null, _sprite);
            } else {
                list = Scratch.vm.runtime.startHats('event_whenstageclicked', null, _sprite);
            }

            //if not sync, don't wait until the threads handling the event finished executing
            if (!sync) {
                resolve('async resolve');
            }

            let topBlocks = [];
            for (let thread of list) {
                topBlocks.push(thread.topBlock);
            }

            let action = new Action(topBlocks);
            activeActions.push(action);

            setTimeout(() => {
                if (!sync) {
                    console.log(`Timeout after ${timeout} ms`)
                    Scratch.vm.stopAll();
                    Scratch.simulationEnd.resolve();
                }
                reject();
            }, timeout);

            action.actionEnded.promise.then(() => {

                let extraWaitTime = 0;
                let timeSpend = Date.now() - startTime;
                if (delay > timeSpend) {
                    extraWaitTime = delay - timeSpend;
                }

                setTimeout(() => {

                    console.log(`finished click on ${spriteName}`);
                    // save sprites state after click
                    event.nextFrame = new Frame('clickEnd');
                    if (sync) {
                        resolve('sync resolve');
                    }

                }, extraWaitTime);
            });
        });

    }

    greenFlag(data = {}) {
        return this.next((resolve, reject) => {

            let delay = data.delay || 0;
            let timeout = data.timeout || actionTimeout;
            let sync = data.sync;
            if (sync === undefined) sync = true;

            let startTime = Date.now();

            let event = new Event('greenFlag');
            event.previousFrame = new Frame('greenFlag');
            log.addEvent(event);

            let list = Scratch.vm.runtime.startHats('event_whenflagclicked');

            //if not sync, don't wait until the threads handling the event finished executing
            if (!sync) {
                resolve('async resolve');
            }

            let topBlocks = [];
            for (let thread of list) {
                topBlocks.push(thread.topBlock);
            }

            let action = new Action(topBlocks);
            activeActions.push(action);

            setTimeout(() => {
                if (!sync) {
                    console.log(`Timeout after ${timeout} ms`)
                    Scratch.vm.stopAll();
                    Scratch.simulationEnd.resolve();
                }
                reject();
            }, timeout);

            action.actionEnded.promise.then(() => {

                let extraWaitTime = 0;
                let timeSpend = Date.now() - startTime;
                if (delay > timeSpend) {
                    extraWaitTime = delay - timeSpend;
                }

                setTimeout(() => {
                    console.log(`finished greenFlag()`);
                    event.nextFrame = new Frame('greenFlagEnd');
                    if (sync) {
                        resolve('sync resolve');
                    }
                }, extraWaitTime);
            });
        });
    }

    pressKey(data = {}) {

        return this.next((resolve, reject) => {

            let key = data.key || ' ';
            let delay = data.delay || 0;
            let timeout = data.timeout || actionTimeout;
            let sync = data.sync;
            if (sync === undefined) sync = true;

            let startTime = Date.now();
            console.log(`${getTimeStamp()}: press ${key}`);

            dodona.startTestCase(`Druk op toets: ${key}`);

            // save sprites state before click
            let event = new Event('key', {key: key});
            event.previousFrame = new Frame('key');
            log.addEvent(event);

            let keyData = {key: key, isDown: true};
            let scratchKey = Scratch.vm.runtime.ioDevices.keyboard._keyStringToScratchKey(data.key);

            if (scratchKey === '') {
                console.log('Geen herkende key meegegeven');
                reject();
            }

            let list = Scratch.vm.runtime.startHats('event_whenkeypressed', {
                KEY_OPTION: scratchKey
            });

            let list2 = Scratch.vm.runtime.startHats('event_whenkeypressed', {
                KEY_OPTION: 'any'
            });

            //if not sync, don't wait until the threads handling the event finished executing
            if (!sync) {
                resolve('async resolve');
            }

            let topBlocks = [];
            for (let thread of list) {
                topBlocks.push(thread.topBlock);
            }
            for (let thread of list2) {
                topBlocks.push(thread.topBlock);
            }

            let action = new Action(topBlocks);
            activeActions.push(action);

            setTimeout(() => {
                if (!sync) {
                    console.log(`Timeout after ${timeout} ms`)
                    Scratch.vm.stopAll();
                    Scratch.simulationEnd.resolve();
                }
                reject();
            }, timeout);

            action.actionEnded.promise.then(() => {

                let extraWaitTime = 0;
                let timeSpend = Date.now() - startTime;
                if (delay > timeSpend) {
                    extraWaitTime = delay - timeSpend;
                }

                setTimeout(() => {

                    console.log(`finished keyPress on ${key}`);
                    // save sprites state after click
                    event.nextFrame = new Frame('keyEnd');
                    if (sync) {
                        resolve('sync resolve');
                    }

                }, extraWaitTime);
            });
        });

    }

    moveMouse(data = {}) {
        return this.next((resolve, reject) => {
            data['x'] = data.x + 240;
            data['y'] = data.y + 180;
            data['canvasWidth'] = 480;
            data['canvasHeight'] = 360;
            Scratch.vm.runtime.ioDevices.mouse.postData(data);
            resolve();
        });
    }

    test(testName, messageIfWrong, fun) {
        return this.next((resolve, reject) => {
            let correct = fun(log);
            addCase(testName, correct, messageIfWrong);
            resolve();
        });
    }

    log(fun = (log) => {}) {
        return this.next((resolve, reject) => {
            log.addFrame('manual_logging');
            fun(log);
            resolve();
        });
    }

    reset() {
        log = new Log();
    }

    end() {
        return this.next((resolve, reject) => {
            console.log("Finished simulation");
            for (let event of log.events.list) {
                if (event.nextFrame == null) {
                    event.nextFrame = new Frame('programEnd');
                }
            }
            resolve();

            // stop all Scratch processes
            Scratch.vm.stopAll();
            Scratch.simulationEnd.resolve();
        });

    }
}
