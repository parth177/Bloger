const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../../middleware/authenticate');

// Middleware to authenticate user before accessing protected routes
router.use(authenticateToken);

// Protected route - create a new post
router.post('/posts/create', (req, res) => {
  // Authenticated user's ID is available in req.userId
  const userId = req.userId;

  // Add logic to create a new post using userId
});

module.exports = router;
