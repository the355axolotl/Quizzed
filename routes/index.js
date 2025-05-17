const express = require('express');
var router = express.Router();
const questionModel = require('../model/questions');

router.get('/', function(req, res, next) {
    // Adjust min and max config here for default game settings
    var minQs = 5;
    var maxQs = 50;
    var minTimer = 30;
    var maxTimer = 120;
    var difficulty = "Easy";

    var totalQs = req.session.totalQuestions == null ? minQs : req.session.totalQuestions;
    var time = req.session.timer == null ? minTimer : req.session.timer;
    var difficulty = req.session.difficulty == null ? difficulty : req.session.difficulty;

    if (req.cookies.newSession == "false") {
        res.cookie("newSession", "false");
    } else {
        res.cookie("newSession", "true");
    }
    res.render('./home/index', { 
        title: 'Quizzd',
        totalQuestions: totalQs,
        timer: time,
        minQuestions: minQs,
        maxQuestions: maxQs,
        minTimer: minTimer,
        maxTimer: maxTimer,
        difficulty: difficulty
    });
});

router.get('/results', (req, res) => {
    res.render('./main/results', {
        score: req.session.score,
        totalQuestions: req.session.totalQuestions,
        timer: req.session.timer,
        difficulty: req.session.difficulty
    });
});

router.get('/replay', (req,res) => {
    res.cookie("newSession", "false");
    req.session.score = 0;
    res.redirect('/');
});

module.exports = router;
