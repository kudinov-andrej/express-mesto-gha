const mongoose = require('mongoose');
const usersModel = require('../models/user');

const getUserById = (req, res) => {
  usersModel
    .findById(req.params.userId)
    .orFail(() => {
      throw new Error('DocumentNotFoundError');
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.message === 'DocumentNotFoundError') {
        const ERROR_CODE = 404;
        res.status(ERROR_CODE).send({
          message: 'Запрашиваемый пользователь не найден',
        });
      } else if (err instanceof mongoose.CastError) {
        const ERROR_CODE = 400;
        res.status(ERROR_CODE).send({
          message: 'Данные id переданы не корректно',
        });
      } else {
        res.status(500).send({
          message: 'Internal Server Error',
          err: err.message,
        });
      }
    });
};

const getMi = (req, res) => {
  const { _id } = req.user;
  usersModel
    .findById({ _id })
    .orFail(() => {
      throw new Error('DocumentNotFoundError');
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.message === 'DocumentNotFoundError') {
        const ERROR_CODE = 404;
        res.status(ERROR_CODE).send({
          message: 'Запрашиваемый пользователь не найден',
        });
      } else if (err instanceof mongoose.CastError) {
        const ERROR_CODE = 400;
        res.status(ERROR_CODE).send({
          message: 'Данные id переданы не корректно',
        });
      } else {
        res.status(500).send({
          message: 'Internal Server Error',
          err: err.message,
        });
      }
    });
};

const crateUser = (req, res) => {
  usersModel.create(req.body).then((user) => {
    res.status(200).send(user);
  }).catch((err) => {
    if (err.name === 'ValidationError') {
      const ERROR_CODE = 400;
      res.status(ERROR_CODE).send({
        message: 'Данные для создания карточки переданы не корректно',
      });
      return;
    }
    res.status(500).send({
      message: 'Internal Server Error',
      err: err.message,
    });
  });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  usersModel
    .findOneAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        const ERROR_CODE = 404;
        res.status(ERROR_CODE).send({
          message: 'Запрашиваемый пользователь не найден',
        });
      }
      res.status(200).send({
        id: user.id,
        avatar: user.avatar,
        name,
        about,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const ERROR_CODE = 400;
        res.status(ERROR_CODE).send({
          message: 'Данные для создания карточки переданы не корректно',
        });
      } else {
        res.status(500).send({
          message: 'Internal Server Error',
          err: err.message,
        });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  usersModel.findByIdAndUpdate(req.user._id, { avatar }).then((user) => {
    if (!user) {
      const ERROR_CODE = 404;
      res.status(ERROR_CODE).send({
        message: 'Запрашиваемый пользователь не найден',
      });
    }
    res.status(200).send({
      _id: user._id,
      avatar,
      name: user.name,
      about: user.about,
    });
  }).catch((err) => {
    if (err.name === 'ValidationError') {
      const ERROR_CODE = 400;
      res.status(ERROR_CODE).send({
        message: 'Данные для создания карточки переданы не корректно',
      });
    } else {
      res.status(500).send({
        message: 'Internal Server Error',
        err: err.message,
      });
    }
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
  getMi,
  updateUser,
  updateAvatar,
};
