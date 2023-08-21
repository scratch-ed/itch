/* Copyright (C) 2019 Ghent University - All Rights Reserved */
function duringExecution() {

    actionTimeout = 2000;

    scratch.eventScheduling
        .greenFlag()
        .end();

    scratch.start();
}

function afterExecution() {
    // Er werkt gebruik gemaakt van de pen
    addCase('De pen werkt gebruikt', 
        log.blocks.containsBlock('pen_penDown'),
        'Het blok pen_Down werd niet gebruikt in de code'
    );
}
