function beforeExecution(templateJSON, testJSON) {
    // Check that there are no changes to the built-in functions.
    // TODO: get access to starter file.
    console.log(templateJSON);
    console.log(testJSON);
}

function duringExecution() {
    
    scratch.eventScheduling
        .greenFlag() // We don't need to test the start position, as this should be good.
        .wait(1000)
        .test('Het ruimteschip staat klaar', 'Het ruimteschip mag niet bewegen voor er op 1 gedrukt wordt.',
            (log) => { !log.hasSpriteMoved('Ruimteschip') }
        )
        .pre
    
}