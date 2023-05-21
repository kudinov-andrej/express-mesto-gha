const usersModel = require('../models/user');

const getUserById = (req, res) => {
  usersModel
    .findById(req.params.userId)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(404).send({
          message: 'Запрашиваемый пользователь не найден',
        });
        return;
      }
      res.status(500).send({
        message: 'Internal Server Error',
        err: err.message,
        stack: err.stack,
      });
    });
};

const getMi = (req, res) => {
  const { _id } = req.user;
  usersModel
    .findById({ _id })
    .orFail(() => {
      const error = new Error({
        message: 'Запрашиваемый пользователь не найден',
      });
      error.name = 'UserNotFoundError';
      error.status = 404;
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
  usersModel.create(req.body)
    .orFail(() => {
      throw new Error('bedRequest');
    })
    .then((user) => {
      res.status(200).send(user);
    }).catch((error) => {
      if (error.message === 'bedRequest') {
        res.status(400).send({
          message: 'Данные для создания карточки переданы не корректно',
        });
        return;
      }
      res.status(400).send({
        message: 'Данные для создания карточки переданы не корректно',
        error: error.message,
      });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  usersModel.findByIdAndUpdate(req.user._id, { name, about }).then((user) => {
    res.status(200).send({
      _id: user._id,
      avatar: user.avatar,
      name,
      about,
    });
  }).catch((error) => {
    res.status(500).send({
      massege: 'Ошибка при обработке запроса',
      error: error.massege,
    });
  });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  usersModel.findByIdAndUpdate(req.user._id, { avatar }).then((user) => {
    res.status(200).send({
      _id: user._id,
      avatar,
      name: user.name,
      about: user.about,
    });
  }).catch((error) => {
    res.status(500).send({
      massege: 'Ошибка при обработке запроса',
      error: error.massege,
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
    });
  }
};

module.exports = {
  getUserById,
  getUsers,
  crateUser,
  getMi,
  updateUser,
  updateAvatar,
};
