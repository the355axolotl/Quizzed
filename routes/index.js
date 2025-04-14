const express = require('express');
var router = express.Router();
const questionModel = require('../model/questions');

router.get('/', function(req, res, next) {
    res.render('./views/index', { title : 'Quizzd'});
})

module.exports = router;
