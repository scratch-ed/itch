/* Copyright (C) 2019 Ghent University - All Rights Reserved */
/** @param {Evaluation} e */
function duringExecution(e) {
  e.answers = ['2586', '000', '199999'];

  e.scheduler
    .forEach(_.range(0, e.answers.length, 1), (anchor, index) => {
      return anchor
        .greenFlag()
        .log(() => {
          const getal = e.answers[index];
          const response = e.log.renderer.responses[1 + 2 * index];
          let som = 0;
          for (let i = 0; i < getal.length; i++) {
            som += parseInt(getal[i]);
          }
          e.test(`De berekening van cijfersom ${getal}`, l => {
            l.expect(response).toBe(som.toString());
          });
        });
    })
    .end();
}
