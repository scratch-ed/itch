// TODO: validation
function setupRoutes(server) {
  server.post('/test', (req, res, next) => {
    //const { testPlan, template, submitted } = req.body;

    // TODO: judge.runTests here

    res.send({ result: 'You did not write any code...' });
    next();
  });
}

module.exports = setupRoutes;
