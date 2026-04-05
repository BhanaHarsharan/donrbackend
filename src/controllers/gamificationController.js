const User = require('../models/User');

exports.getStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    const stats = {
      totalDonations: user.total_donations || 0,
      streak: user.current_streak || 0,
      level: user.level || 1,
      livesSaved: user.lives_saved || 0,
    };
    res.json(stats);
  } catch (err) {
    next(err);
  }
};