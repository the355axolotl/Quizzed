var express = require('express');
const { render } = require('../app');
var router = express.Router();


/* GET results page. */

router.get('/results', function(req,res,next){
  res.render('results');
});

router.post('/play', (req, res) => {
  renderPlay(req, res);
});

router.post('/answer', function(req,res,next){
    
});

function renderPlay(req, res) {
  res.render('play');
}

module.exports = router;
