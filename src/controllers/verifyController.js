const { verifyQRToken } = require('../services/qrTokenService');
const User = require('../models/User');

exports.verify = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { valid, payload, error } = verifyQRToken(token);
    if (!valid) {
      return res.status(400).json({ valid: false, error });
    }
    const user = await User.findById(payload.userId);
    if (!user) {
      return res.status(400).json({ valid: false, error: 'User not found' });
    }
    res.json({
      valid: true,
      donor: {
        name: user.full_name,
        sa_id: user.sa_id,
        eligible: payload.eligible
      }
    });
  } catch (err) {
    next(err);
  }
};