const router = require('express').Router();
const cardController = require('../controllers/cards');
const {
  validationCardId,
  validationCreateCard,
} = require('../utils/validation');

router.get('/', cardController.getCards);
router.delete('/:cardId', validationCardId, cardController.deleteCard);
router.post('/', validationCreateCard, cardController.createCard);
router.put('/:cardId/likes', validationCardId, cardController.likeCard);
router.delete('/:cardId/likes', validationCardId, cardController.dislikeCard);
module.exports = router;
