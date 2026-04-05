const QuestionnaireResult = require('../models/QuestionnaireResult');
const { evaluateEligibility } = require('../services/eligibilityService');
const { generateQRToken } = require('../services/qrTokenService');
const Donation = require('../models/Donation');
const User = require('../models/User');
const questions = require('../data/questions.json');

exports.getQuestions = (req, res) => {
  res.json(questions);
};

exports.submit = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const answers = req.body.answers;
    const isEligible = evaluateEligibility(answers);
    await QuestionnaireResult.create(userId, answers, isEligible);

    if (!isEligible) {
      return res.status(200).json({ eligible: false, message: 'You are not eligible to donate at this time.' });
    }

    // Gamification: record donation and update stats (once per day)
    const alreadyDonatedToday = await Donation.hasDonatedToday(userId);
    if (!alreadyDonatedToday) {
      await Donation.create(userId);
      await User.incrementDonationStats(userId);
    }

    const qrToken = generateQRToken(userId);
    res.json({ eligible: true, qrToken });
  } catch (err) {
    next(err);
  }
};

exports.getHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const history = await QuestionnaireResult.findByUser(userId);
    res.json(history);
  } catch (err) {
    next(err);
  }
};