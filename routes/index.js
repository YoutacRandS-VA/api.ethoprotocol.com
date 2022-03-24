var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Etho Protocol API' ,
    baseurl: 'https://api.ethoprotocol.com'
  });
});

module.exports = router;
