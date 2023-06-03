const mongoose = require('mongoose');
const http2 = require('http2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const usersModel = require('../models/user');
const { MongoClient } = require('mongodb');
const BedRequest = require('../utils/errors/BedRequest'); // 400
const ConflictingRequest = require('../utils/errors/ConflictingRequest'); // 409
const DeletionError = require('../utils/errors/DeletionError'); // 403
const DocumentNotFoundError = require('../utils/errors/DocumentNotFoundError'); // 404
const Unauthorized = require('../utils/errors/Unauthorized'); // 401

const {
  HTTP_STATUS_OK, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = http2.constants;

const getUserById = (req, res, next) => {
  usersModel
    .findById(req.params.userId)
    .orFail(() => {
      throw new DocumentNotFoundError('Запрашиваемый  пользователь не найден');
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.CastError) {
        new BedRequest('Данные для создания пользователя переданы не корректно');
      } else { next(err); }
    });
};

const getMi = (req, res, next) => {
  usersModel
    .findById(req.user._id)
    .orFail(() => {
      throw new DocumentNotFoundError('Запрашиваемый пользователь не найден');
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.CastError) {
        new BedRequest('Данные для создания пользователя переданы не корректно');
      } else { next(err); }
    });
};

const crateUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  const passwordHash = bcrypt.hash(password, 10);
  usersModel.findOne({ email })
    .then(existingUser => {
      if (existingUser) {
        throw new ConflictingRequest('Пользователь с такой почтой уже существует');
      }
      return passwordHash.then((hash) => usersModel.create({
        name, about, avatar, email, password: hash,
      }));
    })
    .then((user) => res.status(HTTP_STATUS_OK).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BedRequest('Данные для создания карточки переданы не корректно');
      } else {
        next(err);
      }
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  usersModel
    .findOneAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        throw new DocumentNotFoundError('Запрашиваемый пользователь не найден');
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
        throw new BedRequest('Данные для создания карточки переданы не корректно');
      } else {
        next(err);
      }
    })
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  usersModel.findByIdAndUpdate(req.user._id, { avatar }).then((user) => {
    if (!user) {
      throw new DocumentNotFoundError('Запрашиваемый пользователь не найден');
    }
    res.status(HTTP_STATUS_OK).send({
      _id: user._id,
      avatar,
      name: user.name,
      about: user.about,
    });
  }).catch((err) => {
    if (err.name === 'ValidationError') {
      throw new BedRequest('Данные для создания карточки переданы не корректно');
    } else {
      next(err);
    }
  })
    .catch(next);
};

const getUsers = async (req, res, next) => {
  try {
    const users = await usersModel.find({});
    res.send(users);
  } catch (err) {
    next(err);
  };
};


const login = (req, res) => {
  const { email, password } = req.body;
  let user;
  usersModel.findOne({ email }).select('+password')
    .then((foundUser) => {
      if (!foundUser) {
        return Promise.reject(new Unauthorized('Неправильные почта или пароль'));
      }
      user = foundUser;
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        return Promise.reject(new Unauthorized('Неправильные почта или пароль'));
      }
      const userToken = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ userToken });
    })
    .catch(next);
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
