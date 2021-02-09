const express = require('express');

const router = express.Router();
const { corpController } = require('../controllers/corporate');

const { ROLES } = require('../lib/roles');
const { authMiddleware } = require('../middleware/auth');

// App API
router.post('/points/add', authMiddleware([ROLES.USER]), corpController.addPointsToCorporate);

// CRUD API
router.get('/', authMiddleware([ROLES.ADMIN]), corpController.getCorps);
router.post('/', authMiddleware([ROLES.ADMIN]), corpController.createCorps);
router.put('/', authMiddleware([ROLES.ADMIN]), corpController.updateCorp);
router.get('/:corpid', authMiddleware([ROLES.ADMIN]), corpController.getCorpById);
router.delete('/:corpid', authMiddleware([ROLES.ADMIN]), corpController.deleteCorp);

module.exports = router;
