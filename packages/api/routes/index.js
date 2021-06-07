const test = require('./test');
const startTest = require('./startTest');

function setupRoutes(server, browser) {
  server.post('/test', (...args) => test(...args, browser));
  server.post('/start-test', (...args) => startTest(...args, browser));
}

module.exports = setupRoutes;
