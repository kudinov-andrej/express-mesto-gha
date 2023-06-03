const http2 = require('http2');

const {
  // eslint-disable-next-line max-len
  HTTP_STATUS_FORBIDDEN,
} = http2.constants;

class DeletionError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = HTTP_STATUS_FORBIDDEN;
    this.name = 'Deletion Error';
  }
}

module.exports = DeletionError;
