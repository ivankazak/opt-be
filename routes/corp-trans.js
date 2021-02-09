const express = require('express');

const router = express.Router();
const { corpTransController } = require('../controllers/corp-trans');

const { ROLES } = require('../lib/roles');
const { authMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware([ROLES.ADMIN]), corpTransController.getCropTrans);
router.post('/', authMiddleware([ROLES.ADMIN]), corpTransController.createCropTrans);
router.put('/', authMiddleware([ROLES.ADMIN]), corpTransController.updateCropTrans);
router.get('/:corptranid', authMiddleware([ROLES.ADMIN]), corpTransController.getCropTransById);
router.delete('/:corptranid', authMiddleware([ROLES.ADMIN]), corpTransController.deleteCropTrans);

module.exports = router;
