const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  playHistory: [
    {
      quizDate: { type: String, required: true},
      score: { type: Number, required: true }
    }
  ]
});

module.exports = mongoose.model('User', userSchema);
