const express = require('express');
var router = express.Router();
const questionModel = require('../model/questions')

/* GET home page. */
router.get('/', function(req, res, next) {
  // Any previous session that's on the homepage will now be resetted
  req.session.questions = null;
  req.session.currentQuestion = null;
  req.session.score = null;

  res.render('index', { title: 'Quiz App' });
});

/* GET start quiz Page */
router.get('/start', function(req, res) {
  // Setting the session data 
  req.session.questions = questionsModel.getRandomQuestions(10);
  req.session.currentQuestion = 0;
  req.session.score = 0;

  res.redirect('/quiz')
});

/* GET quiz page */
router.get('/quiz', function(req, res) {
  // Checking if the quiz is in progress
  if (!req.session.questions || req.session.currentQuestion >= req.session.questions.length) {
    return res.redirect('/');
  }

  const question = req.session.questions[req.session.currentQuestion];
  const options = questionsModel.getOptionsForQuestion(question);

  res.render('quiz', {
    question: question,
    options: options,
    questionNumber: req.session.currentQuestion + 1,
    totalQuestions: req.session.questions.length
  });
});

/* POST answer submission */
router.post('/submit', function(req,res) {
  if (!req.session.questions || req.session.currentQuestion >= req.session.questions.length) {
    return res.redirect('/');
  }

  const userAnswer = req.body.answer;
  const question = req.session.questions[req.session.currentQuestion];

  // Checking if the answer is correct
  if (question.answer == userAnswer) {
    req.session.score++;
  }

  // Moving to the next question
  req.session.currentQuestion++;

  // Checking if quiz is complete
  if (req.session.currentQuestion >= req.session.questions.length) {
    res.redirect('results');
  } else {
    res.redirect('/quiz');
  }
});

// Sno try to integrate this code with your results.ejs file

/* GET results page */
router.get('/results', function(req, res) {
  // Check if the quiz was completed 
  if (req.session.score === undefined) {
    return res.redirect('/');
  }

  res.render('results', {
  score: req.session.score,
  });
});




module.exports = router;
