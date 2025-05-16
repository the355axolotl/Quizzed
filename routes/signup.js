const express = require('express');
const User = require('../model/users');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('signup/signup', { error: null });
});

router.post('/', async (req, res) => {
  const { username, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.render('signup/signup', { error: 'Passwords do not match' });
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.render('signup/signup', { error: 'Username already taken' });
  }

  try {
    const newUser = new User({ username, password }); // You can hash the password later
    await newUser.save();
    res.redirect('/signin');
  } catch (err) {
    console.error(err);
    res.render('signup/signup', { error: 'Error creating user' });
  }
});

module.exports = router;
