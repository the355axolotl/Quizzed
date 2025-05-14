const express = require('express');
const router = express.Router();

// Temporary in-memory user store
const users = []; // In real apps, use a database

// GET signup page
router.get('/signup', (req, res) => {
  res.render('signup', { error: null });
});

// POST signup form
router.post('/signup', (req, res) => {
  const { username, password, confirmPassword } = req.body;

  // Simple validation
  if (password !== confirmPassword) {
    return res.render('signup', { error: 'Passwords do not match' });
  }

  const userExists = users.find(user => user.username === username);
  if (userExists) {
    return res.render('signup', { error: 'Username already taken' });
  }

  // Add user (no hashing for now)
  users.push({ username, password });

  // Redirect to login after successful signup
  res.redirect('/login');
});

module.exports = router;
