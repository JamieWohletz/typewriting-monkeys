var express = require('express');
var router = express.Router();
var generate = require('../generator');

/* GET home page. */
router.get('/', function(req, res, next) {
  const submittedCount = req.query.lineCount;
  const lineCount = Math.min(Math.abs(isNaN(submittedCount) ? 1 : submittedCount), 100);
  const poem = generate(lineCount);
  res.render(
    'index', 
    { 
      lineCount: lineCount || 1,
      poem
    }
  );
});

module.exports = router;
