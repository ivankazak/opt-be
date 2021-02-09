const express = require('express');

const router = express.Router();
const { pinController } = require('../controllers/pin');

const { ROLES } = require('../lib/roles');
const { authMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware([ROLES.ADMIN]), pinController.getPins);
router.post('/', authMiddleware([ROLES.ADMIN]), pinController.createPin);
router.put('/', authMiddleware([ROLES.ADMIN]), pinController.updatePin);
router.get('/:pinid', authMiddleware([ROLES.ADMIN]), pinController.getPinById);
router.delete('/:pinid', authMiddleware([ROLES.ADMIN]), pinController.deletePin);

module.exports = router;
