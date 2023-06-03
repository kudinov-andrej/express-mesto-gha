const http2 = require('http2');
const {
  // eslint-disable-next-line max-len
  HTTP_STATUS_UNAUTHORIZE
} = http2.constants;

class Unauthorized extends Error {
  constructor(message) {
    super(message);
    this.status = HTTP_STATUS_UNAUTHORIZE;
    this.name = 'Unauthorized';
  }
}

module.exports = Unauthorized;
