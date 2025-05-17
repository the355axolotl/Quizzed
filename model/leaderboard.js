const mongoose = require('mongoose');

const lbSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  score: { type: Number, required: true }
});

module.exports = mongoose.model('Leaderboard', lbSchema);
