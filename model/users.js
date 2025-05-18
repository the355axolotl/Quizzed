const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  playHistory: [
    {
      quizDate: { type: String, required: true},
      score: { type: Number, required: true }
    }
  ],
  accountDate: { type: Date, default: Date.now },
  bio: { type: String, default: "No bio." }
});

module.exports = mongoose.model('User', userSchema);
