const mongoose = require('mongoose');
const http2 = require('http2');
const usersModel = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {
  HTTP_STATUS_OK, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = http2.constants;

const getUserById = (req, res, next) => {
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

const getMi = (req, res, next) => {
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

const crateUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  const passwordHash = bcrypt.hash(password, 10);
  passwordHash.then((hash) => usersModel.create({
    name, about, avatar, email, password: hash,
  }))
    .then((user) => res.status(HTTP_STATUS_OK).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    })).catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: err.message,
        });
        return;
      }
      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
        message: 'Internal Server Error',
      });
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  usersModel
    .findOneAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        return res.status(HTTP_STATUS_NOT_FOUND).send({
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
      } else {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
          message: 'Internal Server Error',
        });
      }
    });
};

const updateAvatar = (req, res, next) => {
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

const getUsers = async (req, res, next) => {
  try {
    const users = await usersModel.find({});
    res.send(users);
  } catch (err) {
    res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
      message: 'Internal Server Error',
    });
  }
};

const login = (req, res) => {
  const { email, password } = req.body;
  let user;
  usersModel.findOne({ email }).select('+password')
    .then((foundUser) => {
      if (!foundUser) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      user = foundUser;
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      const userToken = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ userToken });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};

module.exports = {
  getUserById,
  getUsers,
  crateUser,
  getMi,
  updateUser,
  updateAvatar,
  login,
};
