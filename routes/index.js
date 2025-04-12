var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/results', function(req,res,next){
  res.render('results');
});

router.get('/replay',function(req,res,next){
  res.render('index');
});

module.exports = router;
