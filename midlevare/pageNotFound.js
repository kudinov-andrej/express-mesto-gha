function pageNotFound(req, res, next) {
  res.status(404);
  const error = new Error('Page not found');
  if (error.message === 'Page not found') {
    res.status(404).send({
      message: 'Страница не найдена',
    });
    return;
  }
  next(error);
}

module.exports = pageNotFound;