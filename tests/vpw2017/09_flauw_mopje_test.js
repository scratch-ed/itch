function duringExecution() {

    actionTimeout = 1000000;

    scratch.eventScheduling
        .greenFlag({sync: false})
        .wait(12000)
        .end();

    scratch.start();
}

function afterExecution() {

   console.log(log);

}
