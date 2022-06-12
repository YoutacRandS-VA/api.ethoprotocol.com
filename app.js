var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('./logger');
const NodeRestServer = require('node-rest-server'); // ES5
const Web3 = require('web3');
let supply = require("./supply.js");

global.web3 = new Web3(new Web3.providers.HttpProvider('https://rpc.ethoprotocol.com'));

const Database=require('./database');
global.pool=new Database();

var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

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
                return { status: 200, payload: await getCirculatingSupply() };
                break;
              case 'totalsupply':
                return { status: 200, payload: await getTotalSupply() };
                break;
  
              case 'node_locations':
                return { status: 200, payload: await getNodeLocations() };
                break;
              case 'network_stats':
                return { status: 200, payload: await getNetworkStats() };
                break;

                
              default:
                return {status: 500, payload: 'Unsupported action'};
              }
          case 'ipfs':
            switch(requestData.queryParams.action) {
              case 'pin':
                return {status: 200, payload: await pinList(requestData.queryParams.address)};
                break;
              default:
                return {status: 500, payload: 'Unsupported action'};
  
            }
          default:
            return {status: 500, payload: 'Unsupported module'};
  
        }
      }
    },
};

NodeRestServer(routeConfig, serverConfig);


var rpcEndpoint = "https://rpc.ethoprotocol.com";


const controllerAddress = '0xc38B47169950D8A28bC77a6Fa7467464f25ADAFc';
const controllerABI = JSON.parse('[ { "constant": true, "inputs": [], "name": "last_completed_migration", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "name": "", "type": "address", "value": "0x" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "constant": false, "inputs": [ { "name": "completed", "type": "uint256" } ], "name": "setCompleted", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "new_address", "type": "address" } ], "name": "upgrade", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "pinToAdd", "type": "string" }, { "name": "pinSize", "type": "uint32" } ], "name": "PinAdd", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "pin", "type": "string" } ], "name": "PinRemove", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "constant": false, "inputs": [], "name": "deleteContract", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "set", "type": "address" } ], "name": "SetAccountCollectionAddress", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "hostingCost", "type": "uint256" } ], "name": "SetHostingCost", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "pinStorageAddress", "type": "address" } ], "name": "SetPinStorageAddress", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "ethoFSDashboardAddress", "type": "address" } ], "name": "SetEthoFSDashboardAddress", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "ethoFSHostingContractsAddress", "type": "address" } ], "name": "SetEthoFSHostingContractsAddress", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "UserAddress", "type": "address" }, { "name": "AccountName", "type": "string" } ], "name": "AddNewUserOwner", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "AccountName", "type": "string" } ], "name": "AddNewUserPublic", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "UserAddress", "type": "address" } ], "name": "RemoveUserOwner", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "RemoveUserPublic", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "MainContentHash", "type": "string" }, { "name": "HostingContractName", "type": "string" }, { "name": "HostingContractDuration", "type": "uint32" }, { "name": "TotalContractSize", "type": "uint32" }, { "name": "pinSize", "type": "uint32" }, { "name": "ContentHashString", "type": "string" }, { "name": "ContentPathString", "type": "string" } ], "name": "AddNewContract", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [ { "name": "HostingContractAddress", "type": "address" }, { "name": "MainContentHash", "type": "string" } ], "name": "RemoveHostingContract", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "HostingContractAddress", "type": "address" }, { "name": "HostingContractExtensionDuration", "type": "uint32" } ], "name": "ExtendContract", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [], "name": "ScrubHostingContracts", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "UserAddress", "type": "address" } ], "name": "GetUserAccountName", "outputs": [ { "name": "value", "type": "string", "value": "" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "UserAddress", "type": "address" } ], "name": "GetUserAccountActiveContractCount", "outputs": [ { "name": "value", "type": "uint32", "value": "0" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "UserAddress", "type": "address" } ], "name": "GetUserAccountTotalContractCount", "outputs": [ { "name": "value", "type": "uint32", "value": "0" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "UserAddress", "type": "address" }, { "name": "ArrayKey", "type": "uint256" } ], "name": "GetHostingContractAddress", "outputs": [ { "name": "value", "type": "address", "value": "0x" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "UserAddress", "type": "address" } ], "name": "CheckAccountExistence", "outputs": [ { "name": "", "type": "bool", "value": false } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "HostingContractAddress", "type": "address" } ], "name": "GetMainContentHash", "outputs": [ { "name": "MainContentHash", "type": "string", "value": "" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "HostingContractAddress", "type": "address" } ], "name": "GetContentHashString", "outputs": [ { "name": "ContentHashString", "type": "string", "value": "" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "HostingContractAddress", "type": "address" } ], "name": "GetContentPathString", "outputs": [ { "name": "ContentPathString", "type": "string", "value": "" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "HostingContractAddress", "type": "address" } ], "name": "GetHostingContractDeployedBlockHeight", "outputs": [ { "name": "value", "type": "uint256", "value": "0" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "HostingContractAddress", "type": "address" } ], "name": "GetHostingContractExpirationBlockHeight", "outputs": [ { "name": "value", "type": "uint256", "value": "0" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "HostingContractAddress", "type": "address" } ], "name": "GetHostingContractStorageUsed", "outputs": [ { "name": "value", "type": "uint32", "value": "0" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "HostingContractAddress", "type": "address" } ], "name": "GetHostingContractName", "outputs": [ { "name": "value", "type": "string", "value": "" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "newOperator", "type": "address" } ], "name": "changeOperator", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "set", "type": "address" } ], "name": "SetAccountCollectionAddress", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "UserAddress", "type": "address" }, { "name": "AccountName", "type": "string" } ], "name": "AddNewUser", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "UserAddress", "type": "address" } ], "name": "RemoveUser", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "newContractAddress", "type": "address" }, { "name": "UserAddress", "type": "address" }, { "name": "HostingContractName", "type": "string" }, { "name": "HostingContractDuration", "type": "uint32" }, { "name": "TotalContractSize", "type": "uint32" } ], "name": "AddHostingContract", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "UserAddress", "type": "address" }, { "name": "HostingContractAddress", "type": "address" } ], "name": "RemoveHostingContract1", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "UserAddress", "type": "address" } ], "name": "GetUserAccountAddress", "outputs": [ { "name": "value", "type": "address" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "UserAddress", "type": "address" } ], "name": "GetUserAccountName", "outputs": [ { "name": "value", "type": "string" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "UserAddress", "type": "address" } ], "name": "GetUserAccountActiveContractCount", "outputs": [ { "name": "value", "type": "uint32" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "UserAddress", "type": "address" } ], "name": "GetUserAccountTotalContractCount", "outputs": [ { "name": "value", "type": "uint32" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "UserAddress", "type": "address" }, { "name": "ArrayKey", "type": "uint256" } ], "name": "GetHostingContractAddress", "outputs": [ { "name": "value", "type": "address" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "UserAddress", "type": "address" } ], "name": "CheckAccountExistence", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "ScrubContractList", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "set", "type": "uint256" } ], "name": "SetHostingContractCost", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "HostingContractAddress", "type": "address" }, { "name": "HostingContractExtensionDuration", "type": "uint32" } ], "name": "ExtendHostingContract", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [ { "name": "HostingContractAddress", "type": "address" } ], "name": "GetMainContentHash", "outputs": [ { "name": "MainContentHash", "type": "string" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "HostingContractAddress", "type": "address" } ], "name": "GetContentHashString", "outputs": [ { "name": "ContentHashString", "type": "string" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "HostingContractAddress", "type": "address" } ], "name": "GetContentPathString", "outputs": [ { "name": "ContentPathString", "type": "string" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "HostingContractAddress", "type": "address" } ], "name": "GetHostingContractDeployedBlockHeight", "outputs": [ { "name": "value", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "HostingContractAddress", "type": "address" } ], "name": "GetHostingContractExpirationBlockHeight", "outputs": [ { "name": "value", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "HostingContractAddress", "type": "address" } ], "name": "GetHostingContractStorageUsed", "outputs": [ { "name": "value", "type": "uint32" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "HostingContractAddress", "type": "address" } ], "name": "GetHostingContractName", "outputs": [ { "name": "value", "type": "string" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "MainContentHash", "type": "string" }, { "name": "HostingContractName", "type": "string" }, { "name": "HostingContractDuration", "type": "uint32" }, { "name": "TotalContractSize", "type": "uint32" }, { "name": "ContentHashString", "type": "string" }, { "name": "ContentPathString", "type": "string" } ], "name": "AddHostingContract", "outputs": [ { "name": "value", "type": "address" } ], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [ { "name": "CustomerAddress", "type": "address" }, { "name": "HostingContractAddress", "type": "address" }, { "name": "AccountCollectionAddress", "type": "address" } ], "name": "RemoveHostingContract2", "outputs": [ { "name": "value", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "AccountCollectionAddress", "type": "address" } ], "name": "SetAccountCollectionAddress", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" } ]');


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
    "blocktime": blockTime.toString(),
    "difficulty": difficulty.toString(),
    "hashrate": (difficulty / blockTime).toString(),
  };
}

async function getCirculatingSupply() {
  let coins=0;
  let blockheight;
  
  await web3.eth.getBlockNumber()
    .then(async (result)=> {
      blockheight=result;
      coins=await supply.getCirculationSupply();
  
    })
    .catch((error)=>{
      logger.error("#app.getNetworkStats: Error %s", error);
    })
  return {
    "BlockHeight": blockheight.toString(),
    "CirculatingSupply": coins.toString(),
  }
  
}

async function getTotalSupply() {
  let coins=0;
  let blockheight;
  
  await web3.eth.getBlockNumber()
    .then(async (result)=> {
      blockheight=result;
      coins=await supply.getTotalSupply();
      
    })
    .catch((error)=>{
      logger.error("#app.getNetworkStats: Error %s", error);
      
    })
  return {
    "BlockHeight": blockheight.toString(),
    "TotalSupply": coins.toString(),
  }
  
}

async function getNodeLocations() {
  
  let sql = 'select * from node_coordinates';
  
  let res = await global.pool.query(sql).then((rows)=> {
    let response=[];
    let i;
    for (i=0;i<rows.length;i++) {
      
      response.push({
        id: rows[i].id,
        x: rows[i].x,
        y: rows[i].y,
        nodetype: rows[i].nodettype
      });
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

  return {
    "activeUploadContracts": rows[0].pin_count.toString(),
    "networkStorageAvailable": networkStorageAvailable.toString(),
    "totalNetworkStorageUs": (networkStorageAvailable / 101.649142).toString(),
    "active_gatewaynodes": rows[0].gn_count.toString(),
    "active_masternodes": rows[0].mn_count.toString(),
    "active_servicenodes": rows[0].sn_count.toString(),
    "gatewaynode_reward": rows2[0].gnrewardamount.toString(),
    "masternode_reward": rows2[0].mnrewardamount.toString(),
    "servicenode_reward": rows2[0].snrewardamount.toString()
  }
}

module.exports = app;
