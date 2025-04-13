var express = require('express');
var router = express.Router();
/* Constant score to test */
var score = "6/10"
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('./home/index',{ title: 'Quizzd' });
});


router.get('/results', function(req,res,next){
  res.render('./main/results', {score});
});

router.get('/replay',function(req,res,next){
  res.render('index');
});

module.exports = router;
