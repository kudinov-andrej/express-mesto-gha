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
      res.status(400).send({
        message: 'Internal Server Error',
        err: err.message,
      });
    });
};

const likeCard = async (req, res) => {
  try {
    const card = await cardsModel.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      res.status(404).send({
        message: 'Карточка не найдена',
      });
      return;
    }
    res.status(200).send(card);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      res.status(400).send({
        message: 'Неверный формат идентификатора карточки',
      });
      return;
    }
    res.status(500).send({
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

async function dislikeCard(req, res) {
  try {
    const card = await cardsModel.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true }
    );
    if (!card) {
      res.status(404).send({
        message: 'Карточка не найдена',
      });
      return;
    }
    res.status(200).send(card);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      res.status(400).send({
        message: 'Неверный формат идентификатора карточки',
      });
      return;
    }
    res.status(500).send({
      message: 'Internal Server Error',
      error: error.message,
    });
  }
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
