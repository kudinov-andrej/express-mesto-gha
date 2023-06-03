const http2 = require('http2');

const {
  // eslint-disable-next-line max-len
  HTTP_STATUS_NOT_FOUND,
} = http2.constants;

class DocumentNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = HTTP_STATUS_NOT_FOUND;
    this.name = 'Document Not Found Error';
  }
}

module.exports = DocumentNotFoundError;
