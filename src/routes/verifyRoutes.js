const express = require('express');
const { verify } = require('../controllers/verifyController');
const router = express.Router();

router.get('/:token', verify);

module.exports = router;