// db.js
const mongoose = require('mongoose');

require("dotenv").config();
const MONGO_URI = process.env.DB_URI;

mongoose.connect(MONGO_URI, {
  dbName: 'quizzed'
  
})
.then(() => console.log(' MongoDB Atlas connected'))
.catch(err => console.error(' MongoDB connection error:', err));
