class BedRequest extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
    this.name = 'Bed Request';
  }
}

module.exports = BedRequest;