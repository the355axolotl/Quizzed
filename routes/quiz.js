var express = require('express');
var router = express.Router();


/* GET results page. */

router.get('/results', function(req,res,next){
  res.render('results');
});

router.post('/answer', function(req,res,next){
    
});

module.exports = router;
