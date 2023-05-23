const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');
const pageNotFound = require('./midlevare/pageNotFound');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

const app = express();

app.use(express.json());

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
