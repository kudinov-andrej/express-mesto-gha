class DeletionError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
    this.name = 'Deletion Error';
  }
}

module.exports = DeletionError;