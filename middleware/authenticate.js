// middleware/authenticate.js

const jwt = require('jsonwebtoken');

// Middleware to authenticate user using JWT token
exports.authenticateToken = (req, res, next) => {
  // Get token from request headers
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  // Verify token
  jwt.verify(token, 'your_secret_key', (err, decodedToken) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    // Add decoded token data to request object for further use
    req.userId = decodedToken.userId;
    next();
  });
};
