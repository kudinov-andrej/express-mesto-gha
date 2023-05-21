const router = require('express').Router();
const userController = require('../controllers/users');

router.get('/', userController.getUsers);

router.get('/me', userController.getMi);

router.get('/:userId', userController.getUserById);

router.post('/', userController.crateUser);

module.exports = router;
