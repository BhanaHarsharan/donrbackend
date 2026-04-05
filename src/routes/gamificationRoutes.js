const express = require('express');
const { getStats } = require('../controllers/gamificationController');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/stats', auth, getStats);

module.exports = router;