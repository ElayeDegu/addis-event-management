const jwt = require('jsonwebtoken');

// Generate Access Token
function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' }); // 15 minutes
}

// Generate Refresh Token
function generateRefreshToken(user) {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' }); // 7 days
}

module.exports = { generateAccessToken, generateRefreshToken };
