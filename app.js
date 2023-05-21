const express = require('express');
const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const bodyParser = require('body-parser');
const router = require('./routes');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

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

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: new mongoose.Types.ObjectId('6469c2c51e45aec90d0e6a90'),
  };
  next();
});
app.use(router);
app.use(pageNotFound);

app.listen(3000, () => {
  console.log('Приложение слушает на 3000 порту');
});
