var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/play/start', function(req, res, next) {
  res.render('./main/play', { title: 'Express' });
});

module.exports = router;