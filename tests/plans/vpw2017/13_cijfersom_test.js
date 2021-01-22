/* Copyright (C) 2019 Ghent University - All Rights Reserved */
/** @param {Evaluation} e */
function duringExecution(e) {
  e.answers = ['2586', '000', '199999'];

  e.eventScheduling
    .range(0, e.answers.length, 1, (index, anchor) => {
      return anchor
        .greenFlag()
        .log((log) => {
          const getal = e.answers[index];
          const response = log.renderer.responses[1 + 2 * index];
          let som = 0;
          for (let i = 0; i < getal.length; i++) {
            som += parseInt(getal[i]);
          }
          e.output.addTest(`De berekening van cijfersom ${getal}`, som.toString(), response, 'De cijfersom werd niet correct berekend');
        });
    })
    .end();
}
