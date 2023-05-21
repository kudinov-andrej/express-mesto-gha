const express = require('express');
const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const bodyParser = require('body-parser');
const router = require('./routes');


mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: new mongoose.Types.ObjectId('64665d8e43e2a5875b590ac8'),
  };
  next();
});

app.use(router);

app.listen(3000, () => {
  console.log('Приложение слушает на 3000 порту');
});
