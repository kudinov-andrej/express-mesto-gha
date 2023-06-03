const mongoose = require('mongoose');
const http2 = require('http2');
const cardsModel = require('../models/card');

const {
  // eslint-disable-next-line max-len
  HTTP_STATUS_CREATED, HTTP_STATUS_OK, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = http2.constants;

const BedRequest = require('../utils/errors/BedRequest'); // 400
const ConflictingRequest = require('../utils/errors/ConflictingRequest'); // 409
const DeletionError = require('../utils/errors/DeletionError'); // 403
const DocumentNotFoundError = require('../utils/errors/DocumentNotFoundError'); // 404
const Unauthorized = require('../utils/errors/Unauthorized'); // 401


const getCards = (req, res, next) => {
  cardsModel
    .find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(() => {
      next(err);
    });
};

const createCard = (req, res, next) => {
  cardsModel
    .create({
      owner: req.user._id,
      ...req.body,
    })
    .then((card) => {
      res.status(HTTP_STATUS_CREATED).send(card);
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        new BedRequest('Данные для создания карточки переданы не корректно');
      } else { next(err); }
    });
};

const deleteCard = (req, res, next) => {
  cardsModel
    .findById(req.params.cardId)
    .orFail(() => {
      throw new DocumentNotFoundError('Запрашиваемая карточка не найдена');
    })
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (req.user._id.toString() === card.owner.toString()) {
        return cardsModel.findByIdAndRemove(req.params.cardId);
      } else {
        throw new DeletionError('Нет прав для удаления карточки');
      };
    })
    .then((removedCard) => {
      if (removedCard) {
        res.send(removedCard);
      } else {
        throw new DocumentNotFoundError('Запрашиваемая карточка не найдена');
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.CastError) {
        new BedRequest('Данные для создания карточки переданы не корректно');
      } else { next(err); }
    });
};

const likeCard = async (req, res, next) => {
  try {
    const card = await cardsModel.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
      .orFail(() => {
        throw new Error('DocumentNotFoundError');
      });
    res.status(HTTP_STATUS_OK).send(card);
  } catch (err) {
    if (err.message === 'DocumentNotFoundError') {
      res.status(HTTP_STATUS_NOT_FOUND).send({
        message: 'Запрашиваемая карточка не найдена',
      });
    } else if (err instanceof mongoose.CastError) {
      res.status(HTTP_STATUS_BAD_REQUEST).send({
        message: 'Данные id карточки переданы не корректно',
      });
    } else {
      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
        message: 'Internal Server Error',
      });
    }
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    const card = await cardsModel.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
      .orFail(() => {
        throw new Error('DocumentNotFoundError');
      });
    res.status(HTTP_STATUS_OK).send(card);
  } catch (err) {
    if (err.message === 'DocumentNotFoundError') {
      res.status(HTTP_STATUS_NOT_FOUND).send({
        message: 'Запрашиваемая карточка не найдена',
      });
    } else if (err instanceof mongoose.CastError) {
      res.status(HTTP_STATUS_BAD_REQUEST).send({
        message: 'Данные id карточки переданы не корректно',
      });
    } else {
      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
        message: 'Internal Server Error',
      });
    }
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
