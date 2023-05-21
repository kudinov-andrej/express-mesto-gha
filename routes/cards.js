const router = require('express').Router();
const cardController = require('../controllers/cards');

router.get('/', cardController.getCards);
router.delete('/:cardId', cardController.deleteCard);
router.post('/', cardController.createCard);

module.exports = router;
