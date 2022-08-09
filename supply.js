
const logger = require("./logger");
const got = require("got");

const supply = module.exports = {
  // Circulating supply is Total supply - dev found - staked etho
  getCirculationSupply: async function () {
    let totalsupply;
    let circulatingsupply;
    let stakingsupply;
  
    totalsupply=await supply.getTotalSupply();
  
    console.log("#app.getCirculatingSupply: Supply %s", totalsupply);
    await got('https://nodes.ethoprotocol.com/ethofsapi.php?api=node_locked_amount')
      .then((res) => {
        logger.info("#supply.getCirculationSupply: %s",res.body);
        stakingsupply=parseInt(res.body);
      })
      .catch((error)=>{
        logger.error("#supply.getCirculatingSupply: Error %s", error);
      })
  
  
    await web3.eth.getBalance("0xBA57dFe21F78F921F53B83fFE1958Bbab50F6b46")
      .then(async (result)=> {
  
        // Changes after discussion in the team 20220809
        // circulatingsupply=totalsupply-stakingsupply-result/1e18;
        circulatingsupply=totalsupply-result/1e18;
      })
      .catch((error)=>{
        logger.error("#app.getCirculatingSupply: Error %s", error);
      })
    return (parseInt(circulatingsupply));
  },
  getTotalSupply: async function () {
  let othercoins=0;
  let miningcoins=0;
  let i=0;
  
  let monitary_block= [1000000, 1000000, 700000,300000,800000,200000,1000000,1000000,1000000, 1000000,150000, 600000, 250000, 1000000, 1000000, 1000000, 1000000];
  let monitary_mining= [    10,       8,    6.4,   5.6,   4.5,   2.4,    1.8,   1.25,    0.8,     0.6,    10,    0.3,    0.3,     0.3,     0.3,     0.3,     0.3];
  let monitary_node= [       2,       2,      2,   2.8,   2.6,   2.4,    1.9,    1.4,      1,     0.8,  0.65,   0.65,   0.65,     0.5,     0.5,    0.55,    0.55];
  let monitary_dev= [        1,       1,      1,     1,     1,     1,      1,    0.8,   0.65,     0.5, 0.35,   0.35,   0.35,    0.25,     0.2,    0.15,    0.15];
  let monitary_special= [    0,       0,      0,     0,     0,     0,      0,      0,      0,       0,     0,21563938,     0,       0,       0,        0,      0];
  let blockheight;
  
  await web3.eth.getBlockNumber()
    .then((result)=> {
      blockheight=result;
      // We run all but the last array element
      for (i=0; i<monitary_block.length-1; i++) {
        if (result-monitary_block[i]<0)
          break;
        else {
          result-=monitary_block[i];
          // we need to distinguish minigcoins which get uncle reward and node / dev reward which is not uncle impacted
          miningcoins+=monitary_mining[i]*monitary_block[i];
          othercoins+=monitary_special[i]+(monitary_node[i]+monitary_dev[i])*monitary_block[i];
        }
      }
      // last arrary element is run here
      miningcoins+=monitary_mining[i]*result;
      // Uncle is approx 3%
      miningcoins=parseInt(miningcoins*1.0345);
      othercoins+=monitary_special[i]+(monitary_node[i]+monitary_dev[i])*result;
      // Remove block 0
      miningcoins-=monitary_mining[0];
      othercoins-=(monitary_node[0]+monitary_dev[0]);
      
      logger.info("Current block %s, Miningcoins tot %s, Other coins tot %s, Tot coins %s", blockheight, miningcoins, othercoins, parseInt(miningcoins+othercoins));
    })
    .catch((error)=>{
      logger.error("#app.getNetworkStats: Error %s", error);
    })
  return (parseInt(miningcoins+othercoins));
  },
};
