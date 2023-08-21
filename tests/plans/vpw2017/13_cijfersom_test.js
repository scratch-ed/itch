/* Copyright (C) 2019 Ghent University - All Rights Reserved */
function duringExecution() {

    scratch.answers = ['2586','000','199999'];

    scratch.eventScheduling
        .range(0, scratch.answers.length, 1, (index, anchor) => {
            return anchor
                .greenFlag()
                .log((log) => {
                    let getal = scratch.answers[index];
                    let response = log.renderer.responses[1 + 2*index];
                    let som = 0;
                    for (let i = 0; i < getal.length; i++) {
                        som += parseInt(getal[i]);
                    }
                    addTest(`De berekening van cijfersom ${getal}`, som.toString(), response, 'De cijfersom werd niet correct berekend');
                })
        })
        .end();

    scratch.start();
}
