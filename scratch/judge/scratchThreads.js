
function promiseTimeout(promise, ms){

    // Create a promise that rejects in <ms> milliseconds
    let timeout = new Promise((resolve, reject) => {
        setTimeout(() => {
            reject('Timed out in '+ ms + 'ms.')
        }, ms)
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
        this.actionEnded = new Promise();
        this.active = true;
    }

    update(topBlock) {
        let newTopBlocks = [];
        for (let topB in this.topBlocks) {
            if (topB !== topBlock) {
                newTopBlocks.push(topB);
            }
        }
        if (newTopBlocks.length === 0) {
            // resolven
            this.actionEnded.resolve();
            this.active = false;
        }
        this.topBlocks = newTopBlocks;
    }
}
