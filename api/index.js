require('dotenv').config();
const setupRoutes = require('./routes/index.js');

const restify = require('restify');
const logger = require('morgan');

const server = restify.createServer();
logger.format('my-simple-format', ':method :url :status');

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

setupRoutes(server);

server.listen(process.env.PORT, function () {
  console.log(`listening on port ${process.env.PORT}`);
});
