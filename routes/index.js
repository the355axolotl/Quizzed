const express = require('express');
var router = express.Router();
const questionModel = require('../model/questions');

router.get('/', function(req, res, next) {
    var totalQs = req.session.totalQuestions == null ? 5 : req.session.totalQuestions;
    var time = req.session.timer == null ? 30 : req.session.timer;

    if (req.cookies.newSession == "false") {
        res.cookie("newSession", "false");
    } else {
        res.cookie("newSession", "true");
    }
    res.render('./home/index', { 
        title: 'Quizzd',
        totalQuestions: totalQs,
        timer: time
    });
});

router.get('/results', (req, res) => {
    res.render('./main/results', {
        score: req.session.score,
        totalQuestions: req.session.totalQuestions,
        timer: req.session.timer
    });
});

router.get('/replay', (req,res) => {
    res.cookie("newSession", "false");
    req.session.score = 0;
    res.redirect('/');
});

module.exports = router;
