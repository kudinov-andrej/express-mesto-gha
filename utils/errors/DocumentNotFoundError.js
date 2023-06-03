class DocumentNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
    this.name = 'Document Not Found Error';
  }
}

module.exports = DocumentNotFoundError;