const express = require('express');

const router = express.Router();
const { userTransactionController } = require('../controllers/user-trans');

const { ROLES } = require('../lib/roles');
const { authMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware([ROLES.ADMIN]), userTransactionController.getUserTransactions);
router.post('/', authMiddleware([ROLES.ADMIN]), userTransactionController.createUserTransaction);
router.put('/', authMiddleware([ROLES.ADMIN]), userTransactionController.updateUserTransaction);
router.get('/:usertranid', authMiddleware([ROLES.ADMIN]), userTransactionController.getUserTransactionById);
router.delete('/:usertranid', authMiddleware([ROLES.ADMIN]), userTransactionController.deleteUserTransaction);

module.exports = router;
