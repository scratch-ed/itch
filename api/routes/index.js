// TODO: validation
function setupRoutes(server) {
  server.post('/test', (req, res, next) => {
    const { testPlan, template, submitted } = req.body;

    console.log('test');

    // TODO: judge.runTests here

    res.send({ TODO: 'Add JSON otput of Dodona here' });
    next();
  });
}

module.exports = setupRoutes;
