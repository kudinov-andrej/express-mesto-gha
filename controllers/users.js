const mongoose = require('mongoose');
const http2 = require('http2');
const usersModel = require('../models/user');

const {
  // eslint-disable-next-line max-len
  HTTP_STATUS_OK, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = http2.constants;

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
        res.status(HTTP_STATUS_NOT_FOUND).send({
          message: 'Запрашиваемый пользователь не найден',
        });
      } else if (err instanceof mongoose.CastError) {
        res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: 'Данные id переданы не корректно',
        });
      } else {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
          message: 'Internal Server Error',
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
        res.status(HTTP_STATUS_NOT_FOUND).send({
          message: 'Запрашиваемый пользователь не найден',
        });
      } else if (err instanceof mongoose.CastError) {
        res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: 'Данные id переданы не корректно',
        });
      } else {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
          message: 'Internal Server Error',
        });
      }
    });
};

const crateUser = (req, res) => {
  usersModel.create(req.body).then((user) => {
    res.status(HTTP_STATUS_OK).send(user);
  }).catch((err) => {
    if (err.name === 'ValidationError') {
      res.status(HTTP_STATUS_BAD_REQUEST).send({
        message: 'Данные для создания карточки переданы не корректно',
      });
      return;
    }
    res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
      message: 'Internal Server Error',
    });
  });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  usersModel
    .findOneAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(HTTP_STATUS_NOT_FOUND).send({
          message: 'Запрашиваемый пользователь не найден',
        });
      }
      res.status(HTTP_STATUS_OK).send({
        id: user.id,
        avatar: user.avatar,
        name,
        about,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: 'Данные для создания карточки переданы не корректно',
        });
      } else if (err instanceof mongoose.CastError) {
        res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: 'Данные id переданы не корректно',
        });
      } else {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
          message: 'Internal Server Error',
        });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  usersModel.findByIdAndUpdate(req.user._id, { avatar }).then((user) => {
    if (!user) {
      res.status(HTTP_STATUS_NOT_FOUND).send({
        message: 'Запрашиваемый пользователь не найден',
      });
    }
    res.status(HTTP_STATUS_OK).send({
      _id: user._id,
      avatar,
      name: user.name,
      about: user.about,
    });
  }).catch((err) => {
    if (err.name === 'ValidationError') {
      res.status(HTTP_STATUS_BAD_REQUEST).send({
        message: 'Данные для создания карточки переданы не корректно',
      });
    } else {
      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
        message: 'Internal Server Error',
      });
    }
  });
};

const getUsers = async (req, res) => {
  try {
    const users = await usersModel.find({});
    res.send(users);
  } catch (err) {
    res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
      message: 'Internal Server Error',
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
