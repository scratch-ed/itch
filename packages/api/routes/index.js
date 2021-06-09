const test = require('./test');
const startTest = require('./startTest');
const health = require('./health');

function setupRoutes(server, browser) {
  server.post('/test', (...args) => test(...args, browser));
  server.post('/start-test', (...args) => startTest(...args, browser));
  server.get('/health', health);
}

module.exports = setupRoutes;
