const mongoose = require('mongoose');
const cardsModel = require('../models/card');

const getCards = (req, res) => {
  cardsModel
    .find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Internal Server Error',
        err: err.message,
      });
    });
};

const createCard = (req, res) => {
  cardsModel
    .create({
      owner: req.user._id,
      ...req.body,
    })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
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

const deleteCard = (req, res) => {
  cardsModel
    .findById(req.params.cardId)
    .orFail(() => {
      throw new Error('DocumentNotFoundError');
    })
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (req.user._id.toString() === card.owner.toString()) {
        return cardsModel.findByIdAndRemove(req.params.cardId);
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
        const ERROR_CODE = 404;
        res.status(ERROR_CODE).send({
          message: 'Данные id карточки переданы не корректно',
        });
      } else if (err.message === 'DocumentNotFoundError') {
        const ERROR_CODE = 404;
        res.status(ERROR_CODE).send({
          message: 'Запрашиваемая карточка не найдена',
        });
      } else {
        res.status(500).send({
          message: 'Internal Server Error',
          err: err.message,
        });
      }
    });
};

const likeCard = async (req, res) => {
  try {
    const card = await cardsModel.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
      .orFail(() => {
        throw new Error('DocumentNotFoundError');
      });
    res.status(200).send(card);
  } catch (err) {
    if (err.message === 'DocumentNotFoundError') {
      const ERROR_CODE = 404;
      res.status(ERROR_CODE).send({
        message: 'Запрашиваемая карточка не найдена',
      });
    } else if (err instanceof mongoose.CastError) {
      const ERROR_CODE = 400;
      res.status(ERROR_CODE).send({
        message: 'Данные id карточки переданы не корректно',
      });
    } else {
      res.status(500).send({
        message: 'Internal Server Error',
        err: err.message,
      });
    }
  }
}

async function dislikeCard(req, res) {
  try {
    const card = await cardsModel.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
      .orFail(() => {
        throw new Error('DocumentNotFoundError');
      });
    res.status(200).send(card);
  } catch (err) {
    if (err.message === 'DocumentNotFoundError') {
      const ERROR_CODE = 404;
      res.status(ERROR_CODE).send({
        message: 'Запрашиваемая карточка не найдена',
      });
    } else if (err instanceof mongoose.CastError) {
      const ERROR_CODE = 400;
      res.status(ERROR_CODE).send({
        message: 'Данные id карточки переданы не корректно',
      });
    } else {
      res.status(500).send({
        message: 'Internal Server Error',
        err: err.message,
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
