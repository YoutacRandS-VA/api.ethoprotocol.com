var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Express' ,
    baseurl: 'https://api.ethoprotocol.com'
  });
});

module.exports = router;
