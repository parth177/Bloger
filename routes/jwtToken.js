// auth.js

const jwt = require('jsonwebtoken');

// Function to generate JWT token
function generateToken(user) {
  return jwt.sign({ userId: user.id }, 'your_secret_key', { expiresIn: '1h' });
}

module.exports = { generateToken };
