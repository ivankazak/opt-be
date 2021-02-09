const express = require('express');

const router = express.Router();
const { otpController } = require('../controllers/otp');

router.post('/generate', otpController.generate);
router.post('/verify', otpController.verify);

module.exports = router;
