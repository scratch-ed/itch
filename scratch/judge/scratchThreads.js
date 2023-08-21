/* Copyright (C) 2019 Ghent University - All Rights Reserved */
async function promiseTimeout(future, ms){

    // Create a promise that rejects in <ms> milliseconds
    let timeout = new Promise((resolve, reject) => {
        setTimeout(() => {
            reject('Timed out in '+ ms + 'ms.')
        }, ms)
    });

    let promise = new Promise((resolve, reject) => {
        future.promise.then(() => resolve());
    });

    // Returns a race between our timeout and the passed in promise
    return Promise.race([
        promise,
        timeout
    ])
}

class Action {
    constructor(topBlocks){
        this.startTime = getTimeStamp();
        this.topBlocks = topBlocks;
        this.actionEnded = new Future();
        this.active = true;

        // if the list with topBlocks is empty, no threads have started
        if (topBlocks === undefined || topBlocks.length === 0) {
            this.actionEnded.resolve();
        }
    }

    update(topBlock) {
        let newTopBlocks = [];
        for (let topB of this.topBlocks) {
            if (topB !== topBlock) {
                newTopBlocks.push(topB);
            }
        }
        if (newTopBlocks.length === 0) {
            this.actionEnded.resolve();
            this.active = false;
        }
        this.topBlocks = newTopBlocks;
    }
}
