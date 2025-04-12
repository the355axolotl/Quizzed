var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('./home/index',{ title: 'Quizzd' });
});

router.get('/results', function(req,res,next){
  res.render('./main/results');
});

router.get('/replay',function(req,res,next){
  res.render('index');
});

module.exports = router;
