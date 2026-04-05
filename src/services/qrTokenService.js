const jwt = require('jsonwebtoken');

function generateQRToken(userId) {
  const payload = {
    userId,
    eligible: true,
    exp: Math.floor(Date.now() / 1000) + (24 * 3600)
  };
  return jwt.sign(payload, process.env.QR_SECRET);
}

function verifyQRToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.QR_SECRET);
    return { valid: true, payload: decoded };
  } catch (err) {
    return { valid: false, error: err.message };
  }
}

module.exports = { generateQRToken, verifyQRToken };