const http2 = require('http2');

const { HTTP_STATUS_INTERNAL_SERVER_ERROR } = http2.constants;

function ErrorHandler(err, req, res, next) {
  const { responseStatus = err.status || HTTP_STATUS_INTERNAL_SERVER_ERROR, message } = err;
  res.status(responseStatus).send({ message: responseStatus === HTTP_STATUS_INTERNAL_SERVER_ERROR ? 'Internal Server Error' : message });
  next();
}

module.exports = ErrorHandler;
