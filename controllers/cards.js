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
        stack: err.stack,
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
      res.status(500).send({
        message: 'Internal Server Error',
        err: err.message,
        stack: err.stack,
      });
    });
};

const deleteCard = (req, res) => {
  cardsModel
    .findById(req.params.cardId)
    .orFail(() => {
      const error = new Error('Карточки не существует');
      error.name = 'CardNotFoundError';
      throw error;
    })
    .then((card) => {
      if (req.user._id.toString() === card.owner.toString()) {
        return cardsModel.findByIdAndRemove(req.params.cardId);
        // eslint-disable-next-line no-else-return
      } else {
        const error = new Error('Попытка удалить чужую карточку');
        error.name = 'UnauthorizedError';
        throw error;
      }
    })
    .then((removedCard) => {
      if (removedCard) {
        res.send(removedCard);
      } else {
        const error = new Error('Карточки не существует');
        error.name = 'CardNotFoundError';
        throw error;
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Internal Server Error',
        err: err.message,
        stack: err.stack,
      });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
};
