const usersModel = require('../models/user');

const getUserById = (req, res) => {
  usersModel
    .findById(req.params.userId)
    .orFail(() => {
      const error = new Error('Пользователь не найден');
      error.name = 'UserNotFoundError';
      throw error;
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Internal Server Error',
        err: err.message,
        stack: err.stack,
      });
    });
};

const crateUser = (req, res) => {
  usersModel.create(req.body).then((user) => {
    res.status(200).send(user);
  }).catch((error) => {
    res.status(500).send({
      massege: 'Ошибка при обработке запроса',
      error: error.massege,
      stack: error.stack,
    });
  });
};

const getUsers = async (req, res) => {
  try {
    const users = await usersModel.find({});
    res.send(users);
  } catch (err) {
    res.status(500).send({
      message: 'Internal Server Error',
      err: err.message,
      stack: err.stack,
    });
  }
};

module.exports = {
  getUserById,
  getUsers,
  crateUser,
};
