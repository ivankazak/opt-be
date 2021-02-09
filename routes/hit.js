const express = require('express');

const router = express.Router();
const { hitController } = require('../controllers/hit');

const { ROLES } = require('../lib/roles');
const { authMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware([ROLES.ADMIN]), hitController.getHits);
router.post('/', authMiddleware([ROLES.ADMIN]), hitController.createHit);
router.put('/', authMiddleware([ROLES.ADMIN]), hitController.updateHit);
router.get('/:hitid', authMiddleware([ROLES.ADMIN]), hitController.getHitById);
router.delete('/:hitid', authMiddleware([ROLES.ADMIN]), hitController.deleteHit);

module.exports = router;
