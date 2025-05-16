// db.js
const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://quiz:axolotl@cluster0.lddgovb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGO_URI, {
  
  
})
.then(() => console.log(' MongoDB Atlas connected'))
.catch(err => console.error(' MongoDB connection error:', err));
