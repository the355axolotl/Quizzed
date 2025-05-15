const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  password: String
}, { collection: 'users' }); // 👈 Use existing collection name

module.exports = mongoose.model('User', userSchema);
