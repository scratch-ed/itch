function addTest(testName, expected, generated, message, correct = null) {
    let status;
    dodona.startTestCase(testName);
    dodona.startTest(expected);
    if (generated !== undefined) {
        if (generated === expected) {
            status = {enum: 'correct', human: 'Correct'};
        } else {
            dodona.addMessage(message);
            status = {enum: 'wrong', human: 'Fout'};
        }
    } else {
        status = {enum: 'runtime error', human: 'Error: resultaat is undefined'};
    }

    if (correct != null) {
        if (correct) {
            status = {enum: 'correct', human: 'Correct'};
        }
        if (!correct) {
            dodona.addMessage(message);
            status = {enum: 'wrong', human: 'Fout'};
        }
    }

    dodona.closeTest(generated, status);
    dodona.closeTestCase();
}


function addCase(caseName, correct, message = 'Verkeerd') {
    dodona.startTestCase(caseName);
    let status;
    if (correct) {
        status = {enum: 'correct', human: 'Correct'};
    }
    if (!correct) {
        dodona.addMessage(message);
        status = {enum: 'wrong', human: 'Fout'};
    }
    //console.log(JSON.stringify(status), correct);
    dodona.closeTestCase(status);
}


function addMessage(message) {
    dodona.addMessage(message);
}

function addError(message) {
    //todo return message in error format for dodona if possible.
    dodona.addMessage(message);
}

