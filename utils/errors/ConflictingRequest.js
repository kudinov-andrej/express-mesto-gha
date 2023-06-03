const http2 = require('http2');

const {
  // eslint-disable-next-line max-len
  HTTP_STATUS_CONFLICT,
} = http2.constants;

class ConflictingRequest extends Error {
  constructor(message) {
    super(message);
    this.status = HTTP_STATUS_CONFLICT;
    this.name = 'Conflicting Request';
  }
}
module.exports = ConflictingRequest;
