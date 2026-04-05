const pool = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  static async create({ sa_id, full_name, email, phone, date_of_birth, password }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (sa_id, full_name, email, phone, date_of_birth, password_hash)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, sa_id, full_name, email, phone, date_of_birth`,
      [sa_id, full_name, email, phone, date_of_birth, hashedPassword]
    );
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query('SELECT id, sa_id, full_name, email, phone, date_of_birth, total_donations, current_streak, level, lives_saved FROM users WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async incrementDonationStats(userId) {
    // Get current user data
    const userResult = await pool.query(
      `SELECT last_donation_date, current_streak, total_donations
       FROM users WHERE id = $1`,
      [userId]
    );
    const user = userResult.rows[0];
    if (!user) throw new Error('User not found');

    const now = new Date();
    let newStreak = 1;
    let newTotal = (user.total_donations || 0) + 1;
    let newLivesSaved = newTotal * 3; // each donation saves 3 lives
    let newLevel = Math.floor(newTotal / 5) + 1; // level 1 for 0-4, level 2 for 5-9, etc.

    // Calculate streak based on last donation date (if any)
    if (user.last_donation_date) {
      const lastDate = new Date(user.last_donation_date);
      const daysSinceLast = (now - lastDate) / (1000 * 3600 * 24);
      // SANBS minimum interval is 56 days; consider a donation within 56–70 days as maintaining streak
      if (daysSinceLast >= 56 && daysSinceLast <= 70) {
        newStreak = (user.current_streak || 0) + 1;
      } else {
        newStreak = 1; // reset streak if too short or too long
      }
    }

    await pool.query(
      `UPDATE users SET 
         total_donations = $1,
         last_donation_date = $2,
         current_streak = $3,
         level = $4,
         lives_saved = $5
       WHERE id = $6`,
      [newTotal, now, newStreak, newLevel, newLivesSaved, userId]
    );

    return {
      totalDonations: newTotal,
      streak: newStreak,
      level: newLevel,
      livesSaved: newLivesSaved,
    };
  }
}

module.exports = User;