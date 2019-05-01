function prepare() {

    actionTimeout = 5000;

    scratch.eventScheduling
        .clickSprite({spriteName: 'Heks'}) // De eerste klik laat heks starten met bewegen.
        .wait(1500)
        .clickSprite({spriteName: 'Heks'}) // Deze klik doet helemaal niets.
        .wait(1000)
        .end();

    scratch.start();
}

function evaluate() {



}
