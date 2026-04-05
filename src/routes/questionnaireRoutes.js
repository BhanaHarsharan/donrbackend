const express = require('express');
const { getQuestions, submit, getHistory } = require('../controllers/questionnaireController');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, getQuestions);
router.post('/submit', auth, submit);
router.get('/history', auth, getHistory);  // optional

module.exports = router;