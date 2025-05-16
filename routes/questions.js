const fs = require('fs');
const path = require('path');
const express = require('express');
const { log } = require('console');
const router = express.Router();
var axios = require("axios");
const baseURL = "https://opentdb.com/api.php";
const entities = require("html-entities");

/* GET home page.... */
router.get('/', function(req, res, next) {
    // Any previous session that's on the homepage will now be resetted
    req.session.questions = null;
    req.session.currentQuestion = null;
    req.session.score = null;
  
    res.render('./home/index', { title: 'Quiz App' });
  });


router.post('/', async (req, res) => {
    const numOfQuestions = parseInt(req.body["questions"]);
    let apiData = null
    if (req.cookies.newSession == "true"){
        req.session.questions = null;
        req.session.currentQuestion = null;
        req.session.score = null;
        res.cookie("newSession", "false")
        apiData = getQuestions(req.cookies.session, numOfQuestions);
        //console.log((await apiData).data)
    }


    // Current user session
    req.session.questions = req.session.questions != null ? req.session.questions : (await apiData)?.data;
    req.session.currentQuestion = !req.body["currentQuestion"] ? 0 : parseInt(req.body["currentQuestion"]);
    req.session.score = req.session.score == null ? 0 : parseInt(req.session.score);
    req.session.totalQuestions = numOfQuestions;
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
    }

    let getQuestion = req.session.questions.results[req.session.currentQuestion];
    let choices = getOptionsForQuestion(getQuestion);

    //This should make quotes actually quotes and apotrophies actually apohstrophies
    let fix = entities.decode(getQuestion.question);
    // fix = fix.replaceAll("&quot;", "\"");
    // fix = fix.replaceAll("&#039;", "\'");
    getQuestion.question = fix;
    console.log(getQuestion.question);

    res.render('./main/quiz', {
        question: getQuestion,
        options: choices,
        questionNumber: parseInt(req.session.currentQuestion) + 1,
        questions: numOfQuestions,
        score: req.session.score
    });
});

/* router.post('/next', (req, res) => {
    req.session.questions = getRandomQuestions();
    const question = req.session.questions[0];
    const choices = getOptionsForQuestion(question);

    res.render('./quiz', {
        question: question,
        options: choices,
        questionNumber: 2,
        totalQuestions: req.session.totalQuestions
    });
});

 */
/* POST answer submission */
// router.post('/submit', function(req,res) {
//     if (!req.session.questions || req.session.currentQuestion >= req.session.questions.length) {
//       return res.redirect('/');
//     }
// });



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

