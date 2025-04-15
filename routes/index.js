const express = require('express');
var router = express.Router();
const questionModel = require('../model/questions');

router.get('/', function(req, res, next) {
    if (req.cookies.newSession == "false") {
        res.cookie("newSession", "false");
    } else {
        res.cookie("newSession", "true");
    }
    res.render('./home/index', { title : 'Quizzd'});
});

router.get('/results', (req, res) => {
    res.render('./main/results', {
        score: req.session.score,
        totalQuestions: req.session.totalQuestions
    });
});

router.get('/replay', (req,res) => {
    res.cookie("newSession", "false");
    req.session.score = 0;
    res.redirect('/');
});

module.exports = router;
