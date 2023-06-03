const http2 = require('http2');

const {
  // eslint-disable-next-line max-len
  HTTP_STATUS_BAD_REQUEST,
} = http2.constants;

class BedRequest extends Error {
  constructor(message) {
    super(message);
    this.statusCode = HTTP_STATUS_BAD_REQUEST;
    this.name = 'Bed Request';
  }
}

module.exports = BedRequest;
