const fs = require('fs');
const path = require('path');
const express = require('express');
const { log } = require('console');
const router = express.Router();

/* GET home page.... */
router.get('/', function(req, res, next) {
    // Any previous session that's on the homepage will now be resetted
    req.session.questions = null;
    req.session.currentQuestion = null;
    req.session.currentTime = null;
    req.session.score = null;
  
    res.render('./home/index', { title: 'Quizzd' });
  });


router.post('/', (req, res) => {
    const numOfQuestions = parseInt(req.body["questions"]);

    if (req.cookies.newSession == "true"){
        req.session.questions = null;
        req.session.currentQuestion = null;
        req.session.score = null;
        req.session.timer = null;
        req.session.currentTime = null;
        req.session.difficulty = null;
        res.cookie("newSession", "false")
    }

    // Current user session
    req.session.questions = req.session.questions != null ? req.session.questions : getRandomQuestions(numOfQuestions);
    req.session.currentQuestion = !req.body["currentQuestion"] ? 0 : parseInt(req.body["currentQuestion"]);
    req.session.score = req.session.score == null ? 0 : parseInt(req.session.score);
    req.session.totalQuestions = numOfQuestions;
    req.session.timer = req.session.timer == null ? req.body.timer : req.session.timer;
    req.session.currentTime = req.session.currentTime == null ? req.body.timer : req.body.currentTime;
    req.session.difficulty = req.session.difficulty == null ? req.body.difficulty : req.session.difficulty;
    
    console.log(req.body.answer, req.session.currentQuestion - 1, req.session.questions);
    if (checkAnswer(req.session.currentQuestion - 1, req.body.answer, req.session.questions)){
        req.session.score += 1;
        //console.log(req.body.answer);
    }
    //console.log(req.session.score);
    /* console.log(req.body["currentQuestion"], req.session.totalQuestions) */
    if (req.body["currentQuestion"] >= req.session.totalQuestions){
        res.cookie("newSession", "true")
        res.redirect('/results');
    } else {
        let question = req.session.questions[req.session.currentQuestion];
        let choices = getOptionsForQuestion(question);


        res.render('./main/quiz', {
            title: "Quizzd: Start",
            question: question,
            questions: numOfQuestions,
            questionNumber: parseInt(req.session.currentQuestion) + 1,
            options: choices,
            score: req.session.score,
            timer: req.session.timer,
            currentTime: req.session.currentTime,
            difficulty: req.session.difficulty,
            answer: question["answer"]
        });
    }
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

function loadQuestions() {
    try {
        const data = fs.readFileSync(path.join(__dirname, '../model/questions.json'), 'utf-8');
        return JSON.parse(data);
    } catch(error) {
        console.error('Error loading questions:', error.message);
        return [];
    }
}

function getRandomQuestions(num) {
    const shuffled = [...questionsData].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num)
}

function checkAnswer(questionIndex, userAnswer, questions) {
    const currQuestion = questions[questionIndex];
    if (!currQuestion) return false;
    return currQuestion.answer === userAnswer;
}

function getOptionsForQuestion(question) {
    return [
        { key: 'A', value: question.A},
        { key: 'B', value: question.B},
        { key: 'C', value: question.C},
        { key: 'D', value: question.D},
        
    ];
}

const questionsData = loadQuestions();

module.exports = router;

