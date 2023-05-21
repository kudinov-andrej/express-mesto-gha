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
      res.status(400).send({
        message: 'Данные для создания карточки переданы не корректно',
        err: err.message,
      });
    });
};

const deleteCard = (req, res) => {
  cardsModel
    .findById(req.params.cardId)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((card) => {
      if (req.user._id.toString() === card.owner.toString()) {
        return cardsModel.findByIdAndRemove(req.params.cardId);
      }
    })
    .then((removedCard) => {
      if (removedCard) {
        res.send(removedCard);
      } else {
        throw new Error('NotFound');
      }
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(404).send({
          message: 'Запрашиваемой карточки не существует',
        });
        return;
      }
      res.status(500).send({
        message: 'Internal Server Error',
        err: err.message,
      });
    });
};

const likeCard = (req, res) => {
  cardsModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  ).then((card) => {
    res.status(200).send(card);
  }).catch((err) => {
    res.status(500).send({
      message: 'Internal Server Error',
      err: err.message,
    });
  });
};

const dislikeCard = (req, res) => {
  cardsModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  ).then((card) => {
    res.status(200).send(card);
  }).catch((err) => {
    res.status(500).send({
      message: 'Internal Server Error',
      err: err.message,
    });
  });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
