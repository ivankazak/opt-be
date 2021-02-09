const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.json({ status: 'success' }).end();
});

// app api
router.use('/otp', require('./otp'));

// crud of data models
router.use('/corp-trans', require('./corp-trans'));
router.use('/corps', require('./corporate'));
router.use('/gifts', require('./gift'));
router.use('/hits', require('./hit'));
router.use('/logs', require('./log'));
router.use('/pins', require('./pin'));
router.use('/posts', require('./post'));
router.use('/user-trans', require('./user-trans'));
router.use('/users', require('./users'));

module.exports = router;
