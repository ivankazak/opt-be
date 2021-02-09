const express = require('express');

const router = express.Router();
const { logController } = require('../controllers/log');

const { ROLES } = require('../lib/roles');
const { authMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware([ROLES.ADMIN]), logController.getLogs);
router.post('/', authMiddleware([ROLES.ADMIN]), logController.createLog);
router.put('/', authMiddleware([ROLES.ADMIN]), logController.updateLog);
router.get('/:logid', authMiddleware([ROLES.ADMIN]), logController.getLogById);
router.delete('/:logid', authMiddleware([ROLES.ADMIN]), logController.deleteLog);

module.exports = router;
