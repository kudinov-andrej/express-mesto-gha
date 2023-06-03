class Unauthorized extends Error {
  constructor(message) {
    super(message);
    this.status = 401;
    this.name = 'Unauthorized';
  }
}

module.exports = Unauthorized;
