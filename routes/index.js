var express = require('express');
var router = express.Router();
let supply = require("../supply.js");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Etho Protocol API' ,
    baseurl: 'https://api.ethoprotocol.com'
  });
});

/* GET home page. */
router.get('/totalsupply', async function(req, res, next) {
    res.type('text/plain');
    let test=await supply.getTotalSupply();
    res.send(test.toString());
  });

router.get('/circulatingsupply', async function(req, res, next) {
  res.type('text/plain');
  let test=await supply.getCirculatingSupply();
  res.send(test.toString());
  
});


module.exports = router;
