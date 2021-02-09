const express = require('express');

const router = express.Router();
const { giftController } = require('../controllers/gift');

const { ROLES } = require('../lib/roles');
const { authMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware([ROLES.ADMIN]), giftController.getGifts);
router.post('/', authMiddleware([ROLES.ADMIN]), giftController.createGift);
router.put('/', authMiddleware([ROLES.ADMIN]), giftController.updateGift);
router.get('/:giftid', authMiddleware([ROLES.ADMIN]), giftController.getGiftById);
router.delete('/:giftid', authMiddleware([ROLES.ADMIN]), giftController.deleteGift);

module.exports = router;
