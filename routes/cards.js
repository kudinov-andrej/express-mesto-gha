const router = require('express').Router();
const cardController = require('../controllers/cards');

router.get('/', cardController.getCards);
router.delete('/:cardId', cardController.deleteCard);
router.post('/', cardController.createCard);
router.put('/:cardId/likes', cardController.likeCard);
router.delete('/:cardId/likes', cardController.dislikeCard);
module.exports = router;
