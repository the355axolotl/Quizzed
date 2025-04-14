const express = require('express');
var router = express.Router();
const questionModel = require('../model/questions');

router.get('/', function(req, res, next) {
    res.render('./home/index', { title : 'Quizzd'});
})

router.get('/results', function(req, res, next) {
    res.render('./main/results', { title : 'Results', score: '4'});
});

module.exports = router;
