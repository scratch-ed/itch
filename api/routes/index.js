// TODO: validation
function setupRoutes(server) {
  server.post('/test', (req, res, next) => {
    //const { testPlan, template, submitted } = req.body;

    // TODO: judge.runTests here

    res.send({
      result:
        'Je bent nog niet begonnen met programmeren! Neem een blokje en go go go!',
    });
    next();
  });
}

module.exports = setupRoutes;
