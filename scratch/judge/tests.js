function addTest(testName, expected, generated, message, correct = null) {
    let status;
    dodona.startTestCase(testName);
    dodona.startTest(expected);
    dodona.addMessage(message);
    if (generated !== undefined) {
        if (generated === expected) {
            status = {enum: 'correct', human: 'Correct'};
        } else {
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
            status = {enum: 'wrong', human: 'Fout'};
        }
    }

    dodona.closeTest(generated, status);
    dodona.closeTestCase();
}

