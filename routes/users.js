const router = require('express').Router();
const userController = require('../controllers/users');
const {
  validationUpdateUser,
  validationUpdateAvatar,
  validationUserId,
} = require('../utils/validation');

router.get('/', userController.getUsers);

router.get('/me', userController.getMi);

router.get('/:userId', validationUserId, userController.getUserById);

router.patch('/me', validationUpdateUser, userController.updateUser);

router.patch('/me/avatar', validationUpdateAvatar, userController.updateAvatar);

module.exports = router;
