

function prepare() {

    scratch.events
        .foreach(
            ['Hoofd', 'Stage', 'Goblin', 'Hoofd', 'Hoofd', 'Hoofd', 'Hoofd'],
            (index, target, anchor) => {
                return anchor
                    .clickSprite({spriteName: target, delay: 300, sync: true})
                    .wait(500)
            }
        )
        .end();

    scratch.start();
}

function evaluate(tests) {


}
