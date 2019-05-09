function check(templateJSON, testJSON) {
    return false;
}

function prepare() {

    actionTimeout = 6000;

    scratch.answers = ['Louise'];

    scratch.eventScheduling
        .greenFlag({sync: true})
        .end();

    scratch.start();
}

function evaluate() {

    console.log(log);
}
