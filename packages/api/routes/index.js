const test = require('./test');

function setupRoutes(server, browser) {
  server.post('/test', (...args) => test(...args, browser));
}

module.exports = setupRoutes;
