const express = require('express');
const User = require('../model/users');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('signup/signin', { error: null });
});

router.post('/', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username, password }); // You’ll hash & compare in future

  if (!user) {
    return res.render('signup/signin', { error: 'Invalid username or password' });
  }

  req.session.user = { username: user.username };
  res.cookie("signedin", "true");
  res.redirect('/'); // Or wherever your dashboard is
});

module.exports = router;
