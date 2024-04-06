// routes/auth.js

const bcrypt = require('bcryptjs');
const { User } = require('../../models/User');
const express = require('express');
const router = express.Router();
const { generateToken } = require('../jwtToken'); // Assuming you have a function to generate tokens

router.post('/login', async (req, res) => {
  const user = await User.findOne({ where: { username } });
  if (!user) {
    res.status(401).json({ error: 'Invalid credentials' });
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    res.status(401).json({ error: 'Invalid credentials' });

    // Generate token for the user
    const token = generateToken(user);

    // Send token in response
    res.json({ token });
  } else {
    // If credentials are invalid, send error response
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

module.exports = router;
