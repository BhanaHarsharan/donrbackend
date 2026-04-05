const pool = require('../config/db');

class Donation {
  static async create(userId, donationDate = new Date()) {
    const result = await pool.query(
      `INSERT INTO donations (user_id, donation_date)
       VALUES ($1, $2) RETURNING *`,
      [userId, donationDate]
    );
    return result.rows[0];
  }

  static async hasDonatedToday(userId) {
    const today = new Date().toISOString().slice(0,10);
    const result = await pool.query(
      `SELECT * FROM donations WHERE user_id = $1 AND donation_date = $2`,
      [userId, today]
    );
    return result.rows.length > 0;
  }
}

module.exports = Donation;