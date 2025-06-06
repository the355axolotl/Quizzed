const fs = require('fs');
const path = require('path');
const express = require('express');
const { log } = require('console');
const router = express.Router();
const Leaderboard = require('../model/leaderboard');
var axios = require("axios");
const baseURL = "https://opentdb.com/api.php";
const entities = require("html-entities");

/* GET home page.... */
router.get('/', function(req, res, next) {
    // Any previous session that's on the homepage will now be resetted
    req.session.questions = null;
    req.session.currentQuestion = null;
    req.session.currentTime = null;
    req.session.score = null;
    res.cookie("newSession", "true")
    //Any goobers that try to access using /play in the browser URL will be redirected to the home page
    return res.redirect('/');
  });


router.post('/', async (req, res) => {
    const numOfQuestions = parseInt(req.body["questions"]);
    let apiData = null;
    let difficulty = null;
    if (req.cookies.newSession == "true"){
        req.session.questions = null;
        req.session.currentQuestion = null;
        req.session.score = null;
        req.session.timer = null;
        req.session.currentTime = null;
        res.cookie("newSession", "false")
        difficulty = req.body.difficulty;
        difficulty = difficulty.toLowerCase();
        console.log(difficulty);
        apiData = getQuestions(req.cookies.session, numOfQuestions, difficulty);
        //console.log((await apiData).data)
    }


    // Current user session
    req.session.questions = req.session.questions != null ? req.session.questions : (await apiData)?.data;
    req.session.currentQuestion = !req.body["currentQuestion"] ? 0 : parseInt(req.body["currentQuestion"]);
    req.session.score = req.session.score == null ? 0 : parseInt(req.session.score);
    req.session.totalQuestions = numOfQuestions;
    req.session.timer = req.session.timer == null ? req.body.timer : req.session.timer;
    req.session.currentTime = req.session.currentTime == null ? req.body.timer : req.body.currentTime;
    req.session.difficulty = req.session.difficulty == null ? req.body.difficulty : req.session.difficulty;    

    //The Omega Failsafe in case the server restarts
    //and the new cookie session didn't reset
    //You were a goober and stopped the server in the middle of the questions page 
    //and didn't delete cookies
    if(req.session.questions == null){
        apiData = getQuestions(null, numOfQuestions);
        req.session.questions = (await apiData)?.data;
    }


    //console.log(req.body.answer, req.session.currentQuestion - 1);
    try {
        if (checkAnswer(req.session.currentQuestion - 1, req.body.answer, req.session.questions)){
            req.session.score += 1;
            console.log(req.body.answer);
        }
    } catch (error) {
        console.log("check answer error", error.message)
    }
    console.log(req.body.answer);
    console.log(req.session.score);

    /* console.log(req.body["currentQuestion"], req.session.totalQuestions) */
    if (req.session.currentQuestion >= req.session.totalQuestions){
        res.cookie("newSession", "true")
        return res.redirect('/results');
    } else {
        let getQuestion = req.session.questions.results[req.session.currentQuestion];
        console.log(getQuestion);
        let choices = getOptionsForQuestion(getQuestion);

        //This should make quotes actually quotes and apotrophies actually apohstrophies
        let fix = entities.decode(getQuestion.question);
        // fix = fix.replaceAll("&quot;", "\"");
        // fix = fix.replaceAll("&#039;", "\'");
        getQuestion.question = fix;
        console.log(getQuestion.question);

        res.render('./main/quiz', {
            title: "Quizzd: Start",
            question: getQuestion,
            questions: numOfQuestions,
            questionNumber: parseInt(req.session.currentQuestion) + 1,
            options: choices,
            score: req.session.score,
            timer: req.session.timer,
            currentTime: req.session.currentTime,
            difficulty: req.session.difficulty,
            answer: getQuestion.correct_answer
        });
    }
});



//This might replace getRandomQuestions
//Default null incase you did not get a token
async function getQuestions(token = null, num = 10, difficulty = null, category = null, type = 'multiple'){
    const response = await axios.get(
        baseURL,
        {
            params: {
                amount: num,
                type: type,
                token: token,
                difficulty: difficulty,
                category: category
            }
        }
    );
    console.log(response.data);
    return response;
}



function checkAnswer(questionIndex, userAnswer, questions) {
    const currQuestion = questions.results[questionIndex];
    //console.log(currQuestion);
    if (!currQuestion) return false;
    return entities.decode(currQuestion.correct_answer) === entities.decode(userAnswer);
}


//Figure out how to randomize this
//Put the answers into an array then randomize the array is one idea
function getOptionsForQuestion(question) {
    let array =[];
    array.push(entities.decode(question.correct_answer), entities.decode(question.incorrect_answers[0]),
        entities.decode(question.incorrect_answers[1]), entities.decode(question.incorrect_answers[2]));
    console.log(array);
    array = shuffle(array);
    console.log(array);
    return [
        { key: 'A', value: array[0]},
        { key: 'B', value: array[1]},
        { key: 'C', value: array[2]},
        { key: 'D', value: array[3]},
        
    ];
}

//from stack overflow, it is the Fisher–Yates Shuffle.
//https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
function shuffle(array) {
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}



module.exports = router;

