const http2 = require('http2');

const { HTTP_STATUS_NOT_FOUND } = http2.constants;
function pageNotFound(req, res, next) {
  const err = new Error('DocumentNotFoundError');
  if (err.message === 'DocumentNotFoundError') {
    res.status(HTTP_STATUS_NOT_FOUND).send({
      message: 'Страница не найдена',
    });
  }
  next();
}

module.exports = pageNotFound;
