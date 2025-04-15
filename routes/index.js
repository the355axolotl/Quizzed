const express = require('express');
var router = express.Router();
const questionModel = require('../model/questions');

router.get('/', function(req, res, next) {
    res.render('./home/index', { title : 'Quizzd'});
})

router.get('/results', (req, res) => {
    res.render('./main/results', {
        score: req.session.score,
        totalQuestions: req.session.totalQuestions
    });
});

router.get('/replay', (req,res) => {
    res.redirect('/play')
});

module.exports = router;
