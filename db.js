// db.js
const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://quiz:<axolotl>@cluster0.lddgovb.mongodb.net/quizzed?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log(' MongoDB Atlas connected'))
.catch(err => console.error(' MongoDB connection error:', err));
