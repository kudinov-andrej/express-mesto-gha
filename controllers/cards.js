const mongoose = require('mongoose');
const http2 = require('http2');
const cardsModel = require('../models/card');

const {
  // eslint-disable-next-line max-len
  HTTP_STATUS_CREATED, HTTP_STATUS_OK, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = http2.constants;

const getCards = (req, res, next) => {
  cardsModel
    .find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(() => {
      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
        message: 'Internal Server Error',
      });
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

const deleteCard = (req, res, next) => {
  cardsModel
    .findById(req.params.cardId)
    .orFail(() => {
      throw new Error('DocumentNotFoundError');
    })
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (req.user._id.toString() === card.owner.toString()) {
        return cardsModel.findByIdAndRemove(req.params.cardId);
      } else {
        throw new Error('NoRights');
      }
    })
    .then((removedCard) => {
      if (removedCard) {
        res.send(removedCard);
      } else {
        throw new Error('DocumentNotFoundError');
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.CastError) {
        res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: 'Данные id карточки переданы не корректно',
        });
      } else if (err.message === 'NoRights') {
        res.status(HTTP_STATUS_NOT_FOUND).send({
          message: 'Нет прав для удаления карточки',
        });
      } else if (err.message === 'DocumentNotFoundError') {
        res.status(HTTP_STATUS_NOT_FOUND).send({
          message: 'Запрашиваемая карточка не найдена',
        });
      } else {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
          message: 'Internal Server Error',
        });
      }
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
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
