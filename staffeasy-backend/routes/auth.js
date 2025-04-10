const express = require('express');
const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await req.app.locals.db.collection('users').findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Plain text comparison, since the password is stored in plain text in your DB
    if (password !== user.password) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // If the credentials match, send back user data (without sensitive information)
    const userData = {
      email: user.email,
      username: user.username,
      role: user.role
    };

    res.status(200).json({ message: 'Login successful.', user: userData });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = router;
