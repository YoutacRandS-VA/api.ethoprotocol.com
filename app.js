var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const NodeRestServer = require('node-rest-server'); // ES5
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('https://rpc.ethoprotocol.com'));

const Database=require('./database');
global.pool=new Database();

var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Add rest server

const serverConfig = {
  basePath: '/api',
  port: 8080,
  delay: 2,
  logger: {
    enable: true,
    debug: false,
  },
  filter: (requestData) => {
    return { data: 'calculate' };
  },
  cors: {
    origin: '*'
  },
};

const routeConfig = {
  '/': {
    method: 'GET',
    status: 200,
    controller: async(requestData) => {
        console.log(requestData);
        switch(requestData.queryParams.module) {
          case 'basic':
            switch(requestData.queryParams.action) {
              case 'chaininfo':
                return { status: 200, payload: await getNetworkStats(10) };
                break;
              case 'supply':
                return { status: 200, payload: await getSupply() };
                break;
              case 'node_locations':
                return { status: 200, payload: await getNodeLocations() };
                break;
              case 'network_stats':
                return { status: 200, payload: await getNetworkStats() };
                break;
  
              default:
                return ('Failed');
            }
          default:
            return('Failed');
  
        }
      }
    },
};

NodeRestServer(routeConfig, serverConfig);


var address = "0x7D7F26c07e97BaFa185676C36508cC898757839F";
var rpcEndpoint = "https://rpc.ethoprotocol.com";


const controllerAddress = '0xc38B47169950D8A28bC77a6Fa7467464f25ADAFc';
const controllerABI = JSON.parse('[ { "constant": true, "inputs": [], "name": "last_completed_migration", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "name": "", "type": "address", "value": "0x" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "constant": false, "inputs": [ { "name": "completed", "type": "uint256" } ], "name": "setCompleted", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "new_address", "type": "address" } ], "name": "upgrade", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "pinToAdd", "type": "string" }, { "name": "pinSize", "type": "uint32" } ], "name": "PinAdd", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "pin", "type": "string" } ], "name": "PinRemove", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "constant": false, "inputs": [], "name": "deleteContract", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "set", "type": "address" } ], "name": "SetAccountCollectionAddress", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "hostingCost", "type": "uint256" } ], "name": "SetHostingCost", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "pinStorageAddress", "type": "address" } ], "name": "SetPinStorageAddress", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "ethoFSDashboardAddress", "type": "address" } ], "name": "SetEthoFSDashboardAddress", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "ethoFSHostingContractsAddress", "type": "address" } ], "name": "SetEthoFSHostingContractsAddress", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "UserAddress", "type": "address" }, { "name": "AccountName", "type": "string" } ], "name": "AddNewUserOwner", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "AccountName", "type": "string" } ], "name": "AddNewUserPublic", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "UserAddress", "type": "address" } ], "name": "RemoveUserOwner", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "RemoveUserPublic", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "MainContentHash", "type": "string" }, { "name": "HostingContractName", "type": "string" }, { "name": "HostingContractDuration", "type": "uint32" }, { "name": "TotalContractSize", "type": "uint32" }, { "name": "pinSize", "type": "uint32" }, { "name": "ContentHashString", "type": "string" }, { "name": "ContentPathString", "type": "string" } ], "name": "AddNewContract", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [ { "name": "HostingContractAddress", "type": "address" }, { "name": "MainContentHash", "type": "string" } ], "name": "RemoveHostingContract", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "HostingContractAddress", "type": "address" }, { "name": "HostingContractExtensionDuration", "type": "uint32" } ], "name": "ExtendContract", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [], "name": "ScrubHostingContracts", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "UserAddress", "type": "address" } ], "name": "GetUserAccountName", "outputs": [ { "name": "value", "type": "string", "value": "" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "UserAddress", "type": "address" } ], "name": "GetUserAccountActiveContractCount", "outputs": [ { "name": "value", "type": "uint32", "value": "0" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "UserAddress", "type": "address" } ], "name": "GetUserAccountTotalContractCount", "outputs": [ { "name": "value", "type": "uint32", "value": "0" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "UserAddress", "type": "address" }, { "name": "ArrayKey", "type": "uint256" } ], "name": "GetHostingContractAddress", "outputs": [ { "name": "value", "type": "address", "value": "0x" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "UserAddress", "type": "address" } ], "name": "CheckAccountExistence", "outputs": [ { "name": "", "type": "bool", "value": false } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "HostingContractAddress", "type": "address" } ], "name": "GetMainContentHash", "outputs": [ { "name": "MainContentHash", "type": "string", "value": "" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "HostingContractAddress", "type": "address" } ], "name": "GetContentHashString", "outputs": [ { "name": "ContentHashString", "type": "string", "value": "" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "HostingContractAddress", "type": "address" } ], "name": "GetContentPathString", "outputs": [ { "name": "ContentPathString", "type": "string", "value": "" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "HostingContractAddress", "type": "address" } ], "name": "GetHostingContractDeployedBlockHeight", "outputs": [ { "name": "value", "type": "uint256", "value": "0" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "HostingContractAddress", "type": "address" } ], "name": "GetHostingContractExpirationBlockHeight", "outputs": [ { "name": "value", "type": "uint256", "value": "0" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "HostingContractAddress", "type": "address" } ], "name": "GetHostingContractStorageUsed", "outputs": [ { "name": "value", "type": "uint32", "value": "0" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "HostingContractAddress", "type": "address" } ], "name": "GetHostingContractName", "outputs": [ { "name": "value", "type": "string", "value": "" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "newOperator", "type": "address" } ], "name": "changeOperator", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "set", "type": "address" } ], "name": "SetAccountCollectionAddress", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "UserAddress", "type": "address" }, { "name": "AccountName", "type": "string" } ], "name": "AddNewUser", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "UserAddress", "type": "address" } ], "name": "RemoveUser", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "newContractAddress", "type": "address" }, { "name": "UserAddress", "type": "address" }, { "name": "HostingContractName", "type": "string" }, { "name": "HostingContractDuration", "type": "uint32" }, { "name": "TotalContractSize", "type": "uint32" } ], "name": "AddHostingContract", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "UserAddress", "type": "address" }, { "name": "HostingContractAddress", "type": "address" } ], "name": "RemoveHostingContract1", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "UserAddress", "type": "address" } ], "name": "GetUserAccountAddress", "outputs": [ { "name": "value", "type": "address" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "UserAddress", "type": "address" } ], "name": "GetUserAccountName", "outputs": [ { "name": "value", "type": "string" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "UserAddress", "type": "address" } ], "name": "GetUserAccountActiveContractCount", "outputs": [ { "name": "value", "type": "uint32" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "UserAddress", "type": "address" } ], "name": "GetUserAccountTotalContractCount", "outputs": [ { "name": "value", "type": "uint32" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "UserAddress", "type": "address" }, { "name": "ArrayKey", "type": "uint256" } ], "name": "GetHostingContractAddress", "outputs": [ { "name": "value", "type": "address" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "UserAddress", "type": "address" } ], "name": "CheckAccountExistence", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "ScrubContractList", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "set", "type": "uint256" } ], "name": "SetHostingContractCost", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "HostingContractAddress", "type": "address" }, { "name": "HostingContractExtensionDuration", "type": "uint32" } ], "name": "ExtendHostingContract", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [ { "name": "HostingContractAddress", "type": "address" } ], "name": "GetMainContentHash", "outputs": [ { "name": "MainContentHash", "type": "string" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "HostingContractAddress", "type": "address" } ], "name": "GetContentHashString", "outputs": [ { "name": "ContentHashString", "type": "string" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "HostingContractAddress", "type": "address" } ], "name": "GetContentPathString", "outputs": [ { "name": "ContentPathString", "type": "string" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "HostingContractAddress", "type": "address" } ], "name": "GetHostingContractDeployedBlockHeight", "outputs": [ { "name": "value", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "HostingContractAddress", "type": "address" } ], "name": "GetHostingContractExpirationBlockHeight", "outputs": [ { "name": "value", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "HostingContractAddress", "type": "address" } ], "name": "GetHostingContractStorageUsed", "outputs": [ { "name": "value", "type": "uint32" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "HostingContractAddress", "type": "address" } ], "name": "GetHostingContractName", "outputs": [ { "name": "value", "type": "string" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "MainContentHash", "type": "string" }, { "name": "HostingContractName", "type": "string" }, { "name": "HostingContractDuration", "type": "uint32" }, { "name": "TotalContractSize", "type": "uint32" }, { "name": "ContentHashString", "type": "string" }, { "name": "ContentPathString", "type": "string" } ], "name": "AddHostingContract", "outputs": [ { "name": "value", "type": "address" } ], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [ { "name": "CustomerAddress", "type": "address" }, { "name": "HostingContractAddress", "type": "address" }, { "name": "AccountCollectionAddress", "type": "address" } ], "name": "RemoveHostingContract2", "outputs": [ { "name": "value", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "AccountCollectionAddress", "type": "address" } ], "name": "SetAccountCollectionAddress", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" } ]');

pinList(address).then(result => {
  console.log(result);
});

function pinList(address) {
  async function getEthofsUploadContract(ethofsContract, hostingContractAddress) {
    const contractData = {
      address: hostingContractAddress,
      data: await ethofsContract.methods.GetHostingContractName(hostingContractAddress).call(),
      ipfsHash: await ethofsContract.methods.GetMainContentHash(hostingContractAddress).call(),
      initiationBlock: await ethofsContract.methods.GetHostingContractDeployedBlockHeight(hostingContractAddress).call(),
      expirationBlock: await ethofsContract.methods.GetHostingContractExpirationBlockHeight(hostingContractAddress).call()
    };
    return await contractData;
  };
  
  return new Promise((resolve, reject) => {
    
    var web3 = new Web3(rpcEndpoint);
    web3.eth.net.isListening()
        .then(function () {
          
          var ethofsContract = new web3.eth.Contract(controllerABI, controllerAddress);
          const uploadContractArray = [];
          
          ethofsContract.methods.GetUserAccountTotalContractCount(address).call(function (error, contractCount) {
            if (!error) {
              if (contractCount) {
                if (contractCount === 0) {
                  resolve(uploadContractArray);
                }
                
                for (let contractIndex = 0; contractIndex < contractCount; contractIndex++) {
                  ethofsContract.methods.GetHostingContractAddress(address, contractIndex).call().then((hostingContractAddress) => {
                    getEthofsUploadContract(ethofsContract, hostingContractAddress).then((result) => {
                      uploadContractArray.push(result);
                      if (uploadContractArray.length >= (contractCount)) {
                        resolve(uploadContractArray);
                      }
                    });
                  });
                }
              } else {
                reject(new Error('ethoFS User Not Found'));
              }
            } else {
              reject(new Error('Ether-1 RPC Access Error: ${error}'));
            }
          });
        });
  });
}


async function getNetworkStats(
  sampleSize //!< [in] Larger n give more accurate numbers but with longer latency.
) {
  let blockNum = await web3.eth.getBlockNumber()
    .then((res)=>{
      return(res);
    })
    .catch((error)=>{
      logger.error("#app.getNetworkStats: Error %s", error);
    })
  let difficulty = await web3.eth.getBlock(blockNum)
    .then((res)=>{
      return(res.difficulty);
    })
    .catch((error)=>{
      logger.error("#app.getNetworkStats: Error %s", error);
    })
  
  
  let blockTime = (await web3.eth.getBlock(blockNum).then((res)=>{return(res.timestamp)}) - await web3.eth.getBlock(blockNum - sampleSize).then((res)=>{return(res.timestamp)})) / sampleSize;
  
  return {
    "blocktime": blockTime,
    "difficulty": difficulty,
    "hashrate": difficulty / blockTime,
  };
}

async function getSupply() {
  let coins=0;
  let i=0;

  let monitary_block= [1000000, 1000000, 1700000,300000,800000,200000,1000000,1000000,1000000,1000000,150000, 600000, 250000, 1000000];
  let monitary_reward= [11, 9.4, 9.4, 8.1, 5.8, 4.7, 3.45, 2.45, 1.9, 11, 1.3, 1.3, 1.05, 1];
  let monitary_special= [0, 0, 0, 0, 0, 0, 0, 0, 0, 22000000, 0,0, 0, 0];
  
  await web3.eth.getBlockNumber()
    .then((result)=> {
      for (i=0; i<monitary_block.length; i++) {
        if (result-monitary_block[i]<0)
          break;
        else {
          result-=monitary_block[i];
          coins+=monitary_reward[i]*monitary_block[i]+monitary_special[i];
        }
        console.log(coins);
      }
      coins+=result*monitary_reward[i]+monitary_special[i];
      console.log(coins);
      })
    .catch((error)=>{
      logger.error("#app.getNetworkStats: Error %s", error);
    })
  return {
    "CurrentSupply": coins,
  }
  
  
}

async function getNodeLocations() {
  
  let sql = 'select * from node_coordinates';
  
  let res = await global.pool.query(sql).then((rows)=> {
    let response=[];
    let i;
    for (i=0;i<rows.length;i++) {
      response.push(rows[i]);
    }
    return((response));
  });
  
  return(res);
  
}

async function getNetworkStats() {
  
  let sql = "select * from livestats";
  let sql2 = "select * from reward_tracker order by id DESC LIMIT 0, 1";
  
  let rows=await global.pool.query(sql).then(async(rows)=> {
    return(rows);
  });
  let rows2=await global.pool.query(sql2).then(async(rows2) => {
    return(rows2);
  });
  console.log(rows);
  let networkStorageAvailable = (parseInt(rows[0].gn_count) * 78 + parseInt(rows[0].mn_count) * 38 + parseInt(rows[0].sn_count) * 18) * 1000000000;
  let res=[];
  
  res.push(JSON.stringify("activeUploadContracts:" + rows[0].pin_count));
  res.push("networkStorageAvailable:" + networkStorageAvailable);
  res.push("totalNetworkStorageUs:" + networkStorageAvailable / 101.649142);
  res.push("active_gatewaynodes:" + rows[0].gn_count);
  res.push("active_masternodes:" + rows[0].mn_count);
  res.push("active_servicenodes:" + rows[0].sn_count);
  res.push("gatewaynode_reward:" + rows2[0].gnrewardamount);
  res.push("masternode_reward:" + rows2[0].mnrewardamount);
  res.push("servicenode_reward:" + rows2[0].snrewardamount);
  
  return(res);
  
}

module.exports = app;
