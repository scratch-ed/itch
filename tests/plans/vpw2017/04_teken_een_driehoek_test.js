/* Copyright (C) 2019 Ghent University - All Rights Reserved */
function duringExecution() {

    actionTimeout = 2000;

    scratch.eventScheduling
        .greenFlag({sync: true})
        .end();

    scratch.start();
}

function afterExecution() {

    // Er moet minimum 1 driehoek getekend worden
    addCase('Aantal driehoeken', 1 >= log.getTriangles().length, 'Er minder dan 1 driehoek getekend');

    // Er werd gebruik gemaakt van de pen
    addCase('De pen werd gebruikt', log.blocks.containsBlock('pen_penDown'), 'Het blok pen_down werd niet gebruikt in de code');
}
