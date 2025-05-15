const express = require('express');
const router = express.Router();

// Temporary in-memory user store
const users = []; // Use a real DB in production

router.get('/', (req, res) => {
  res.render('signup/signin', { error: null });
});
;
// POST sign-in form
router.post('/', (req, res) => {
  const { username, password } = req.body;

  // Look for a user match
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.render('signup/signin', { error: 'Invalid username or password' });
  }

  // TODO: Set session/cookie here if needed

  // Redirect to dashboard or quiz
  res.redirect('/index'); // Change route to whatever you want
});

module.exports = router;
