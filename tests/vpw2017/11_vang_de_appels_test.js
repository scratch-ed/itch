function beforeExecution(templateJSON, testJSON) {
    // Controleer of het ingediende project van de leerling een sprite heeft met als naam 'Heks'
    if(!containsSprite(testJSON, 'Appel')){
        addError('De sprite met als naam Appel werd niet teruggevonden in het project');
    }
    if(!containsSprite(testJSON, 'Kom')){
        addError('De sprite met als naam Kom werd niet teruggevonden in het project');
    }

    //Check if a variable exists
    let i = 0;
    for (let target of testJSON.targets) {
        i += Object.keys(target.variables).length;
    }
    if (i < 1) {
        addError('Er moet minimum 1 variabele bestaan');
    }
    console.log(i);
}

function duringExecution() {
    actionTimeout = 10000;

    let appelPositie = {};

    scratch.eventScheduling
        .log((log) => {
            appelPositie['x'] = log.sprites.getSprite('Appel').x;
            appelPositie['y'] = log.sprites.getSprite('Appel').y;
        })
        .test('De variabele begint op 0', 'De aangemaakte variabele heeft niet de waarde 0', (log) => {
            let variabele = -1;
            let frame = log.sprites;
            for (let sprite of frame.sprites) {
                if (sprite['variabeles']) console.log(sprite['variables']);
            }
        })
        .wait(2000)
        .greenFlag({sync: false})
        .range(0,4000,200,(index, anchor) => {
            return anchor
                .moveMouse({x: Math.random()*200, y: 0})
                .wait(200)
                .log((log) => {
                    appelPositie['x'] = log.sprites.getSprite('Appel').x;
                    console.log(appelPositie);
                })
        })
        .end();

    scratch.start();
}

function afterExecution() {
   console.log(log);
}

