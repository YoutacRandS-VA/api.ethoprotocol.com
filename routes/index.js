var express = require('express');
var router = express.Router();
var logger = require('morgan');

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
    let test=await getTotalSupply();
    res.send(test.toString());
  });

router.get('/circulatingsupply', async function(req, res, next) {
  res.type('text/plain');
  let test=await getCirculatingSupply();
  res.send(test.toString());
  
});

async function getTotalSupply() {
  let coins=0;
  let i=0;
  
  let monitary_block= [1000000, 1000000, 700000,300000,800000,200000,1000000,1000000,1000000, 1000000,150000, 600000, 250000, 1000000, 100000];
  let monitary_reward= [    13,      11,    9.4,   9.4,   8.1,   5.8,    4.7,   3.45,   2.45,     1.9,    11,    1.3,    1.3,    1.05,      1];
  let monitary_special= [    0,       0,      0,     0,     0,     0,      0,      0,      0,       0,     0,22000000,      0,       0,      0];
  let blockheight;
  
  await web3.eth.getBlockNumber()
    .then((result)=> {
      blockheight=result;
      for (i=0; i<monitary_block.length; i++) {
        if (result-monitary_block[i]<0)
          break;
        else {
          result-=monitary_block[i];
          coins+=monitary_reward[i]*monitary_block[i]+monitary_special[i];
        }
      }
      coins+=result*monitary_reward[i]+monitary_special[i];
      // Uncle is approx 6.25%
      coins=parseInt(coins*1.0625);
    })
    .catch((error)=>{
      logger.error("#app.getNetworkStats: Error %s", error);
    })
  return (coins);
}

async function getCirculatingSupply() {
  let totalsupply;
  let circulatingsupply;
  
  totalsupply=await getTotalSupply();

  console.log("#app.getCirculatingSupply: Supply %s", totalsupply);
  await web3.eth.getBalance("0xBA57dFe21F78F921F53B83fFE1958Bbab50F6b46")
    .then(async (result)=> {
      
      circulatingsupply=totalsupply-result/1e18;
    })
    .catch((error)=>{
      logger.error("#app.getCirculatingSupply: Error %s", error);
    })
  return (circulatingsupply);
}

module.exports = router;
