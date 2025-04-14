const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();



router.post('/', (req, res) => {
    const numOfQuestions = req.body["questions"];

    // Current user session
    req.session.questions = getRandomQuestions();
    req.session.currentQuestion = 0;
    req.session.score = 0;


});

function loadQuestions() {
    try {
        const data = fs.readFileSync(path.join(__dirname, '../../model/questions.json'), 'utf-8');
        return JSON.parse(data);
    } catch(error) {
        console.error('Error loading questions:', error.message);
        return [];
    }
}

function getRandomQuestions(count = numOfQuestions) {
    const shuffled = [...questionsData].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count)
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

