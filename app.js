const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');
const pageNotFound = require('./midlevare/pageNotFound');
const ErrorHandler = require('./midlevare/ErrorHandler');
const { celebrate, Joi, errors, Segments } = require('celebrate');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

const app = express();

app.use(express.json());
app.use(router);
//app.use(ErrorHandler);
app.use(pageNotFound);
app.use(errors());

app.listen(3000, () => {
  console.log('Приложение слушает на 3000 порту');
});
