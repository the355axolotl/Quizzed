const express = require('express');
var router = express.Router();
const questionModel = require('../model/questions');
const Leaderboard = require('../model/leaderboard');
const User = require('../model/users');
const users = require('../model/users');



router.get('/', function(req, res, next) {
    if (req.cookies.newSession == "false") {
        res.cookie("newSession", "false");
    } else {
        res.cookie("newSession", "true");
    }
    if(req.cookies.signedin == "true"){
        res.render('./home/index')
    } else {
        res.redirect('./signup');
    }
});

router.get('/results',  async (req, res) => {

    try {
        const score = req.session.score;
        const username = req.cookies.username;



        // Each element in the playHistory array stores a JSON object with the date, score
        const gameEntry = {
            quizDate: new Date(), // Current date and time
            score: score
        };

        // Find the user and push the new game entry to their playHistory array
        const userUpdateResult = await User.findOneAndUpdate(
            { username: username },
            { $push: { playHistory: gameEntry } }, // Using the mongoDB $push operator to add the new entry
            { new: true } // Return the updated document
        );

        console.log('Successfully updated user play history!');
        console.log(userUpdateResult);



        const result = await Leaderboard.findOneAndUpdate (
            { username: username }, // Find the user in the Leaderboard collection
            { $max: { score: score} },
            {
                upsert: true, // Upsert is a MongoDB operation that updates the document if it exists in the collection, o.w. it creates a new one
                new: true,
                setDefaultsOnInsert: true,
            }
        );  // Saving the leaderboard entry to the DB 

        console.log(result);
        console.log("User saved to leaderboard!");
        console.log('Here are the top 10 scores!');
        const result2 = await Leaderboard.find({}).sort({ score: -1 }).limit(10); // Fetching the top 10 scores in descending order
        console.log(result2);
    } catch (err) {
        console.error(err);
    }
   


    res.render('./main/results', {
        score: req.session.score,
        totalQuestions: req.session.totalQuestions
    });
    //user name and score and save it
});


router.get('/replay', (req,res) => {
    res.cookie("newSession", "false");
    req.session.score = 0;
    res.redirect('/');
});

router.get('/leaderboard', async (req, res) => {
    try {
        const result = await Leaderboard.find({}).sort({ score: -1 }).limit(10); 
        const test = 10;
        console.log(result);
        console.log(test);
        res.render('./main/leaderboard', { 
            result: result,
            test: test
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving leaderboard data');
    }
});

router.get('/play-history', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.cookies.username }); // Performing a query to find the user in the DB
        const history = user.playHistory;
        console.log(history);
        console.log(history[0].quizDate);
        console.log(history[0].score);
        res.render('./main/play-history', {
            userHistory: history
    });
    } catch (err) {
        console.error(err);
        res.redirect('/'); // Redirect to the home page if there's an error
    }
});

module.exports = router;
