const express = require('express');

const router = express.Router();
const { userController } = require('../controllers/user');

const { ROLES } = require('../lib/roles');
const { authMiddleware } = require('../middleware/auth');

// app api
router.post('/login', userController.login);
router.get('/affiliate/get/:userid', authMiddleware([ROLES.USER]), userController.getAffiliate);
router.get('/pins/forward', authMiddleware([ROLES.USER]), userController.getForwardPin);
router.post('/pins/forward', authMiddleware([ROLES.USER]), userController.forwardPin);
router.get('/pins/get', authMiddleware([ROLES.USER]), userController.getPins);
router.post('/points/use', authMiddleware([ROLES.USER]), userController.rewardPoint);
router.post('/forget', userController.forgotPassword);

// crud
router.get('/', authMiddleware([ROLES.ADMIN]), userController.getUsers);
router.post('/', authMiddleware([ROLES.ADMIN]), userController.createUser);
router.put('/', authMiddleware([ROLES.ADMIN]), userController.updateUser);
router.get('/:userid', authMiddleware([ROLES.ADMIN]), userController.getUserById);
router.delete('/:userid', authMiddleware([ROLES.ADMIN]), userController.deleteUser);

module.exports = router;
