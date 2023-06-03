const mongoose = require('mongoose');

const http2 = require('http2');

const { ValidationError } = mongoose.Error;
const cardsModel = require('../models/card');

const {
  // eslint-disable-next-line max-len
  HTTP_STATUS_CREATED,
  HTTP_STATUS_OK,
} = http2.constants;

const BedRequest = require('../utils/errors/BedRequest'); // 400
const DeletionError = require('../utils/errors/DeletionError'); // 403
const DocumentNotFoundError = require('../utils/errors/DocumentNotFoundError'); // 404

const getCards = (req, res, next) => {
  cardsModel
    .find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
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
        next(new BedRequest('Данные для создания карточки переданы не корректно'));
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
      }
      throw new DeletionError('Нет прав для удаления карточки');
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
        next(new BedRequest('Данные для создания карточки переданы не корректно'));
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
        throw new DocumentNotFoundError('Запрашиваемая карточка не найдена');
      });
    res.status(HTTP_STATUS_OK).send(card);
  } catch (err) {
    if (err instanceof mongoose.CastError) {
      next(new BedRequest('Данные для создания карточки переданы не корректно'));
    } else { next(err); }
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
        throw new DocumentNotFoundError('Запрашиваемая карточка не найдена');
      });
    res.status(HTTP_STATUS_OK).send(card);
  } catch (err) {
    if (err instanceof mongoose.CastError) {
      next(new BedRequest('Данные для создания карточки переданы не корректно'));
    } else { next(err); }
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
