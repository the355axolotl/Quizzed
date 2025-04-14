const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();

/* GET home page.... */
router.get('/', function(req, res, next) {
    // Any previous session that's on the homepage will now be resetted
    req.session.questions = null;
    req.session.currentQuestion = null;
    req.session.score = null;
  
    res.render('index', { title: 'Quiz App' });
  });


router.post('/', (req, res) => {
    const numOfQuestions = parseInt(req.body["questions"]);

    // Current user session
    req.session.questions = getRandomQuestions();
    req.session.currentQuestion = 0;
    req.session.score = 0;
    req.session.totalQuestions = numOfQuestions;

    const question = req.session.questions[0];
    const choices = getOptionsForQuestion(question);

    res.render('./quiz', {
        question: question,
        options: choices,
        questionNumber: 1,
        totalQuestions: req.session.totalQuestions
    });
});

router.post('/next', (req, res) => {
    req.session.currentQuestion += 1;
    let counter = req.session.currentQuestion
    const question = req.session.questions[counter];
    const choices = getOptionsForQuestion(question);
   
    console.log(req.session.currentQuestion);
    res.render('./quiz', {
        question: question,
        options: choices,
        questionNumber: counter+1,
        totalQuestions: req.session.totalQuestions
    });
});


/* POST answer submission */
router.post('/submit', function(req,res) {
    if (!req.session.questions || req.session.currentQuestion >= req.session.questions.length) {
      return res.redirect('/');
    }
});

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

