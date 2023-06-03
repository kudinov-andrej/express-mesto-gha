const express = require('express');
const mongoose = require('mongoose');
const {
  errors
} = require('celebrate');
const router = require('./routes');
const pageNotFound = require('./midlevare/pageNotFound');
const ErrorHandler = require('./midlevare/ErrorHandler');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

const app = express();

app.use(express.json());
app.use(router);
app.use(errors());
app.use(ErrorHandler);
app.use(pageNotFound);

app.listen(3000, () => {
  console.log('Приложение слушает на 3000 порту');
});
