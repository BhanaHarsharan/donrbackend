const pool = require('../config/db');

class QuestionnaireResult {
  static async create(userId, answers, isEligible) {
    const result = await pool.query(
      `INSERT INTO questionnaire_results (user_id, answers, is_eligible)
       VALUES ($1, $2, $3) RETURNING id, completed_at`,
      [userId, answers, isEligible]
    );
    return result.rows[0];
  }

  static async findByUser(userId) {
    const result = await pool.query(
      `SELECT * FROM questionnaire_results WHERE user_id = $1 ORDER BY completed_at DESC`,
      [userId]
    );
    return result.rows;
  }
}

module.exports = QuestionnaireResult;