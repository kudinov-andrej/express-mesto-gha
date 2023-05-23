function pageNotFound(req, res, next) {
  const err = new Error('DocumentNotFoundError');
  if (err.message === 'DocumentNotFoundError') {
    const ERROR_CODE = 404;
    res.status(ERROR_CODE).send({
      message: 'Страница не найдена',
    });
  }
  next(err);
}

module.exports = pageNotFound;