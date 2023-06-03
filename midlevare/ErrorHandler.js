const http2 = require('http2');

const { HTTP_STATUS_INTERNAL_SERVER_ERROR } = http2.constants;

function ErrorHandler(err, req, res, next) {
  const { statusCode = err.status || HTTP_STATUS_INTERNAL_SERVER_ERROR } = err;
  res.status(statusCode).send({ message: err.statusCode === HTTP_STATUS_INTERNAL_SERVER_ERROR ? 'Internal Server Error' : err.message });
  next();
}

module.exports = ErrorHandler;
