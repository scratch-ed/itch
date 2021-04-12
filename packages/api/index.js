require('dotenv').config();
const setupRoutes = require('./routes/index.js');
const setupBrowser = require('./utils/puppeteer');

const restify = require('restify');
const logger = require('morgan');

const server = restify.createServer();
logger.format('my-simple-format', ':method :url :status');

server.pre(restify.plugins.pre.sanitizePath());

server.pre(function (request, _, next) {
  request.log.info({ req: request.url }, 'REQUEST');
  next();
});

server.use(logger('my-simple-format'));

server.use(restify.plugins.queryParser());
server.use(
  restify.plugins.bodyParser({
    requestBodyOnGet: true,
  }),
);

if (process.env.NODE_ENV === 'development') {
  server.use(function crossOrigin(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    return next();
  });
}

setupBrowser.then((browser) => {
  setupRoutes(server, browser);
  server.listen(process.env.PORT, function () {
    console.log(`listening on port ${process.env.PORT}`);
  });
});
