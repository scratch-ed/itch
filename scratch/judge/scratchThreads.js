

function ensureFinished(topBlock, timeout) {
    const start = Date.now();
    return new Promise(waitForThread);

    function waitForThread(resolve, reject) {
        if (!Scratch.vm.runtime.threads.find(function (obj) { return obj.topBlock === topBlock; })){
            //console.log('RESOLVED FOR '+topBlock+' !!!');
            resolve();
        }
        else if (timeout && (Date.now() - start) >= timeout)
            reject("timeout");
        else
            setTimeout(waitForThread.bind(this, resolve, reject), 30);
    }
}
