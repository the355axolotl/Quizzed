const express = require('express');
var router = express.Router();
const questionModel = require('../model/questions');
const Leaderboard = require('../model/leaderboard');
const User = require('../model/users');
const users = require('../model/users');


var axios = require("axios");

function convertedDay(input) {
    const map = new Map();
    map.set(0, 'Sunday');
    map.set(1, 'Monday');
    map.set(2, 'Tuesday');
    map.set(3, 'Wednesday');
    map.set(4, 'Thursday');
    map.set(5, 'Friday');
    map.set(6, 'Saturday');

    return map.get(input);
}


//This is specifically for session tokens
const baseURL = "https://opentdb.com/api_token.php";

router.get('/', async function(req, res, next) {
    // Adjust min and max config here for default game settings
    var minQs = 5;
    var maxQs = 50;
    var minTimer = 30;
    var maxTimer = 120;
    var difficulty = "Easy";
    var currentTime;
    res.clearCookie('push');

    var totalQs = req.session.totalQuestions == null ? minQs : req.session.totalQuestions;
    var time = req.session.timer == null ? minTimer : req.session.timer;
    var difficulty = req.session.difficulty == null ? difficulty : req.session.difficulty;

    if (req.cookies.newSession == "false") {
        res.cookie("newSession", "false");
    } else {
        res.cookie("newSession", "true");
        //Session Tokens, Asks the api for a session token
        const response = await axios.get(
            baseURL,
            {
                params: {
                    command: "request"
                }
            }
        );
        console.log(response.data);
        console.log(response.data.token)
        res.cookie("session", response.data.token);
    }
    if(req.cookies.signedin == "true"){
        res.render('./home/index', { 
            title: 'Quizzd',
            totalQuestions: totalQs,
            timer: time,
            currentTime: time,
            minQuestions: minQs,
            maxQuestions: maxQs,
            minTimer: minTimer,
            maxTimer: maxTimer,
            difficulty: difficulty,
        });
    } else {
        return res.redirect('./signup');
    }

});

router.get('/results',  async (req, res) => {
    if(req.cookies.signedin != 'true'){
        return res.redirect('/');
    }
    if(req.session.score == null){
        return res.redirect('/');
    }
    if(req.cookies.push == '1'){
        return res.render('./main/results', {
        title: 'Quizzd: Results',
        score: req.session.score,
        totalQuestions: req.session.totalQuestions,
        timer: req.session.timer,
        difficulty: req.session.difficulty
    });
    } else{
        try {
            const score = req.session.score;
            const username = req.cookies.username;
            let date = new Date();
            let dateOfTheWeek = convertedDay(date.getDay());
            let month = date.getMonth() + 1;
            let day = date.getDate();
            let year = date.getFullYear();

            let convertedDate = `${dateOfTheWeek} ${month}/${day}/${year} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`


            // Each element in the playHistory array stores a JSON object with the date, score
            const gameEntry = {
                quizDate: convertedDate, // Displays the date w/o the timezone
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
    res.cookie('push','1');


    res.render('./main/results', {
        title: 'Quizzd: Results',
        score: req.session.score,
        totalQuestions: req.session.totalQuestions,
        timer: req.session.timer,
        difficulty: req.session.difficulty
    });
    //user name and score and save it
    }

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
            test: test,
            title: 'Quizzd'
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving leaderboard data');
    }
});

router.get('/play-history', async (req, res) => {
    if(req.cookies.signedin != 'true'){
        return res.redirect('/');
    }
    const user = await User.findOne({ username: req.cookies.username }); // Performing a query to find the user in the DB
    const history = user.playHistory.reverse(); // Reversing the array to get the play entries from recent to oldest

    res.render('./main/play-history', {
        userHistory: history,
        title: 'Quizzd'
    });    
});

router.get('/user-profile', async (req, res) => {
    if(req.cookies.signedin != 'true'){
        return res.redirect('/');
    }
    const user = await User.findOne({ username: req.cookies.username }); 
    res.render('./main/user-profile', {
        user: user,
        title: 'Quizzd'
    });
});

router.get('/signout', (req,res) => {
    res.cookie("newSession", "true");
    res.cookie("signedin", "false");
    res.clearCookie("username");

    res.redirect('/signin')
});






module.exports = router;
