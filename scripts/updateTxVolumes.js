const Web3 = require('web3');
const { instaListContract, instaEventContract }= require('../contracts/instaDappContracts');
const oasisDexContract = require('../contracts/oasisDexContract');
const kyberReserveContract = require('../contracts/kyberReserveContract');
const { curveSUsdContract, curveSBtcContract, curveYContract } = require('../contracts/curveContracts');
const { getExchangePrice, getEthPriceInUSD } = require('./coinExPrices');
const TxVolume = require('../models/txVolume');
const { WEB3_PROVIDER_URL, TX_VOL_OBJ_ID } = require('../config');

const web3 = new Web3(new Web3.providers.HttpProvider(WEB3_PROVIDER_URL));

/* CONTRACTS */ 

// Curve
const curveSUsd = new web3.eth.Contract(curveSUsdContract.abi, curveSUsdContract.address);
const curveSBtc = new web3.eth.Contract(curveSBtcContract.abi, curveSBtcContract.address);
const curveY = new web3.eth.Contract(curveYContract.abi, curveYContract.address);

// Kyber
const kyberReserve = new web3.eth.Contract(kyberReserveContract.abi, kyberReserveContract.address);

// Oasis
const oasisDex = new web3.eth.Contract(oasisDexContract.abi,  oasisDexContract.address);

// InstaDapp Contract for 1inch and uniswap
const instaEvent = new web3.eth.Contract(instaEventContract.abi, instaEventContract.address);

// InstaDapp contract for finding if address is DSA
const instaList = new web3.eth.Contract(instaListContract.abi, instaListContract.address);


// Updates last 24 hr transaction volume of curve (Susd, Sbtc, Y), kyber, uinswap, 1inch and oasis in usd and eth
async function updateTxVolumes() {
    try {
        const [ curveSusd, curveSbtc, curveY, 
                kyber, uniswap, oneInch, oasis ] = await Promise.all([
                                                                        getCurveSUSDTransactVol(), 
                                                                        getCurveSBTCTransactVol(), 
                                                                        getCurveYTransactVol(),
                                                                        getKyberTransactVol(),
                                                                        getUniswapTransactVol(),
                                                                        getOneInchTransactVol(),
                                                                        getOasisTransactVol(),  
                                                                    ]);
        if(curveSUsd==null || curveSbtc==null ||curveY==null || kyber==null || uniswap==null || oneInch==null || oasis==null)
            return;
        const updates = { curveSusd, curveSbtc, curveY, kyber, uniswap, oneInch, oasis };
        await TxVolume.findByIdAndUpdate(TX_VOL_OBJ_ID,updates, {new:true, upsert:true});
        // console.log(updates);
    }
    catch(err) {
        console.log(err);
    }
}


module.exports = updateTxVolumes;


const tokenDecimals = {
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48": 6,
    "0xdAC17F958D2ee523a2206206994597C13D831ec7": 6,
    "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599":8,
    "0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D":8,
    "0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5":8,
    "0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643":8,
    "0x39aa39c021dfbae8fac545936693ac917d5e7563":8,
    "0xf650C3d88D12dB855b8bf7D11Be6C55A4e07dCC9":8,
    "0xb3319f5d18bc0d84dd1b4825dcde5d5f7266d407":8,
    "0x158079ee67fce2f58472a96584a73c7ab9ac95c1":8,
    "0x6c8c6b02e7b2be14d4fa6022dfd6d75921d90e4e":8,
    "0xc11b1268c1a384e55c48c2391d8d480264a3a7f4":8,
    "0x9bA00D6856a4eDF4665BcA2C2309936572473B7E":6,
    "0x71fc860F7D3A592A4a98740e39dB31d25db65ae8":6,
    "0xFC4B8ED459e00e5400be803A9BB3954234FD50e3":8
};

const tokenPricesInUSD={};

// Gets Curve Susd Transaction Volume (in USD) in Past 24 hrs from Past Events 
async function getCurveSUSDTransactVol() {
    try {
        const tokenAddresses={};
        let volumeInUSD=0;
        const latest = await web3.eth.getBlockNumber();
        const result = await curveSUsd.getPastEvents('TokenExchange',  { fromBlock: latest-10000, toBlock: latest});
        const now = new Date().valueOf();
        const yesterday = now - (24*60*60*1000);
        for(const evt of result) {
            // console.log(evt);
            const { buyer, sold_id, tokens_sold } = evt.returnValues;
            const block = await web3.eth.getBlock(evt.blockHash);
            const blockDate = block.timestamp*1000;     
            // console.log(new Date(blockDate));  
            if(blockDate>=yesterday && blockDate<=now) { 
                const id = await instaList.methods.accountID(buyer).call();
                if(id!=0) {
                    if(!tokenAddresses[sold_id]) 
                        tokenAddresses[sold_id] = await curveSUsd.methods.coins(sold_id).call();
                    const sold_token = tokenAddresses[sold_id];
                    if(!tokenPricesInUSD[sold_token]) {
                        if(sold_token==='0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE')
                            tokenPricesInUSD[sold_token] = await getEthPriceInUSD();
                        else
                            tokenPricesInUSD[sold_token] = await getExchangePrice(sold_token.toLowerCase(),'usd');  
                    }   
                    const divFactor = tokenDecimals[sold_token]==undefined ? 18 : tokenDecimals[sold_token]
                    volumeInUSD+=(tokens_sold/Math.pow(10,divFactor))*tokenPricesInUSD[sold_token];
                }
            }
        }
        const ethPriceInUSD = tokenPricesInUSD['0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'] ? tokenPricesInUSD['0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'] : await getEthPriceInUSD();
        const volumeInEth=volumeInUSD/ethPriceInUSD;
        // console.log({usd:volumeInUSD, eth:volumeInEth});
        return { usd: volumeInUSD, eth: volumeInEth };
    }
    catch(err) {
        console.log(err);
    }
}

// Gets Curve Sbtc Transaction Volume (in USD) in Past 24 hrs from Past Events
async function getCurveSBTCTransactVol() {
    try {
        const tokenAddresses={};
        let volumeInUSD=0;
        const latest = await web3.eth.getBlockNumber();
        const result = await curveSBtc.getPastEvents('TokenExchange',  { fromBlock: latest-10000, toBlock: latest});
        const now = new Date().valueOf();
        const yesterday = now - (24*60*60*1000);
        for(const evt of result) {
            // console.log(evt);
            const { buyer, sold_id, tokens_sold } = evt.returnValues;
            const block = await web3.eth.getBlock(evt.blockHash);
            const blockDate = block.timestamp*1000;     
            // console.log(new Date(blockDate));  
            if(blockDate>=yesterday && blockDate<=now) { 
                const id = await instaList.methods.accountID(buyer).call();
                if(id!=0) {
                    if(!tokenAddresses[sold_id]) 
                        tokenAddresses[sold_id] = await curveSBtc.methods.coins(sold_id).call();
                    const sold_token = tokenAddresses[sold_id];
                    if(!tokenPricesInUSD[sold_token]) {
                        if(sold_token==='0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE')
                            tokenPricesInUSD[sold_token] = await getEthPriceInUSD();
                        else
                            tokenPricesInUSD[sold_token] = await getExchangePrice(sold_token.toLowerCase(),'usd');  
                    }   
                    const divFactor = tokenDecimals[sold_token]==undefined ? 18 : tokenDecimals[sold_token];
                    volumeInUSD+=(tokens_sold/Math.pow(10,divFactor))*tokenPricesInUSD[sold_token];
                }
            }
        }
        const ethPriceInUSD = tokenPricesInUSD['0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'] ? tokenPricesInUSD['0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'] : await getEthPriceInUSD();
        const volumeInEth=volumeInUSD/ethPriceInUSD;
        // console.log({usd:volumeInUSD, eth:volumeInEth});
        return { usd: volumeInUSD, eth: volumeInEth };
    }
    catch(err) {
        console.log(err);
    }
}

// Gets Curve y Transaction Volume (in USD) in Past 24 hrs from Past Events
async function getCurveYTransactVol() {
    try {
        const tokenAddresses={};
        let volumeInUSD=0;
        const latest = await web3.eth.getBlockNumber();
        const result = await curveY.getPastEvents('TokenExchangeUnderlying',  { fromBlock: latest-10000, toBlock: latest});
        const now = new Date().valueOf();
        const yesterday = now - (24*60*60*1000);
        for(const evt of result) {
            // console.log(evt);
            const { buyer, sold_id, tokens_sold } = evt.returnValues;
            const block = await web3.eth.getBlock(evt.blockHash);
            const blockDate = block.timestamp*1000;     
            // console.log(new Date(blockDate));  
            if(blockDate>=yesterday && blockDate<=now) { 
                const id = await instaList.methods.accountID(buyer).call();
                if(id!=0) {
                    if(!tokenAddresses[sold_id]) 
                        tokenAddresses[sold_id] = await curveY.methods.underlying_coins(sold_id).call();
                    const sold_token = tokenAddresses[sold_id];
                    if(!tokenPricesInUSD[sold_token]) {
                        if(sold_token==='0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE')
                            tokenPricesInUSD[sold_token] = await getEthPriceInUSD();
                        else
                            tokenPricesInUSD[sold_token] = await getExchangePrice(sold_token.toLowerCase(),'usd');  
                    }   
                    const divFactor = tokenDecimals[sold_token]==undefined ? 18 : tokenDecimals[sold_token]
                    volumeInUSD+=(tokens_sold/Math.pow(10,divFactor))*tokenPricesInUSD[sold_token];
                }
            }
        }
        const ethPriceInUSD = tokenPricesInUSD['0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'] ? tokenPricesInUSD['0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'] : await getEthPriceInUSD();
        const volumeInEth=volumeInUSD/ethPriceInUSD;
        // console.log({usd:volumeInUSD, eth:volumeInEth});
        return { usd: volumeInUSD, eth: volumeInEth };
    }
    catch(err) {
        console.log(err);
    }
}

// Gets Kyber Transaction Volume (in USD) in Past 24 hrs from Past Events
async function getKyberTransactVol() {
    try {
        let volumeInUSD=0;
        const latest = await web3.eth.getBlockNumber();
        const result = await kyberReserve.getPastEvents('TradeExecute',  { fromBlock: latest-10000, toBlock: latest});
        const now = new Date().valueOf();
        const yesterday = now - (24*60*60*1000);
        for(const evt of result) {
            // console.log(evt);
            const block = await web3.eth.getBlock(evt.blockHash);
            const blockDate = block.timestamp*1000;     
            // console.log(new Date(blockDate));  
            if(blockDate>=yesterday && blockDate<=now) {
                const tx = await web3.eth.getTransaction(evt.transactionHash);       
                const id = await instaList.methods.accountID(tx.to).call();
                if(id!=0) {
                    // console.log(evt.returnValues);
                    const {src:srcToken, srcAmount} = evt.returnValues;
                    if(!tokenPricesInUSD[srcToken]) {
                        if(srcToken==='0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE')
                            tokenPricesInUSD[srcToken] = await getEthPriceInUSD();
                        else
                            tokenPricesInUSD[srcToken] = await getExchangePrice(srcToken.toLowerCase(),'usd');  
                    }   
                    const divFactor = tokenDecimals[srcToken]==undefined ? 18 : tokenDecimals[srcToken];
                    volumeInUSD+=(srcAmount/Math.pow(10,divFactor))*tokenPricesInUSD[srcToken];
                }
            }
        }
        const ethPriceInUSD = tokenPricesInUSD['0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'] ? tokenPricesInUSD['0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'] : await getEthPriceInUSD();
        const volumeInEth=volumeInUSD/ethPriceInUSD;
        // console.log({usd:volumeInUSD, eth:volumeInEth});
        return { usd: volumeInUSD, eth: volumeInEth };
        
    }
    catch(err) {
        console.log(err);
    }
}

// Gets Uniswap Transaction Volume (in USD) in Past 24 hrs from Past Events
async function getUniswapTransactVol() {
    try {
        let volumeInUSD=0;
        const latest = await web3.eth.getBlockNumber();
        const result = await instaEvent.getPastEvents('LogEvent', {fromBlock: latest-10000, toBlock: latest});
        const sellEvtCode = web3.utils.keccak256("LogSell(address,address,uint256,uint256,uint256,uint256)");
        const now = new Date().valueOf();
        const yesterday = now - (24*60*60*1000);
        for(const evt of result) {
            // console.log(evt.returnValues);
            const block = await web3.eth.getBlock(evt.blockHash);
            const blockDate = block.timestamp*1000;     
            // console.log(new Date(blockDate));  
            if(blockDate>=yesterday && blockDate<=now) {
                const { connectorType, connectorID, eventCode, eventData } = evt.returnValues;
                if(eventCode==sellEvtCode && connectorID==30 && connectorType==1) {
                    const evtData = web3.eth.abi.decodeParameters(['address', 'address', 'uint256', 'uint256', 'uint256', 'uint256'],eventData);   
                    const srcToken = evtData[1];
                    const srcAmount = evtData[3];
                    if(!tokenPricesInUSD[srcToken]) {
                        if(srcToken==='0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE')
                            tokenPricesInUSD[srcToken] = await getEthPriceInUSD();
                        else
                            tokenPricesInUSD[srcToken] = await getExchangePrice(srcToken.toLowerCase(),'usd');  
                    }   
                    const divFactor = tokenDecimals[srcToken]==undefined ? 18 : tokenDecimals[srcToken];
                    volumeInUSD+=(srcAmount/Math.pow(10,divFactor))*tokenPricesInUSD[srcToken];
                    // console.log(srcToken, srcAmount, divFactor, volumeInUSD);
                }
            }
        }
        const ethPriceInUSD = tokenPricesInUSD['0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'] ? tokenPricesInUSD['0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'] : await getEthPriceInUSD();
        const volumeInEth=volumeInUSD/ethPriceInUSD;
        // console.log({usd:volumeInUSD, eth:volumeInEth});
        return { usd: volumeInUSD, eth: volumeInEth };
    }
    catch(err) {
        console.log(err);
    }
}

// Gets 1inch Transaction Volume (in USD) in Past 24 hrs from Past Events
async function getOneInchTransactVol() {
    try {
        let volumeInUSD=0;
        const latest = await web3.eth.getBlockNumber();
        const result = await instaEvent.getPastEvents('LogEvent', {fromBlock: latest-10000, toBlock: latest});
        const sellEvtCodes = [  
                                web3.utils.keccak256("LogSell(address,address,uint256,uint256,uint256,uint256)"), 
                                web3.utils.keccak256("LogSellTwo(address,address,uint256,uint256,uint256,uint256)"), 
                                web3.utils.keccak256("LogSellThree(address,address,uint256,uint256,uint256,uint256)")
                            ];
        const now = new Date().valueOf();
        const yesterday = now - (24*60*60*1000);
        for(const evt of result) {
            // console.log(evt.returnValues);
            const block = await web3.eth.getBlock(evt.blockHash);
            const blockDate = block.timestamp*1000;     
            // console.log(new Date(blockDate));  
            if(blockDate>=yesterday && blockDate<=now) {
                const { connectorType, connectorID, eventCode, eventData } = evt.returnValues;
                if(sellEvtCodes.includes(eventCode) && connectorID==17 && connectorType==1) {
                const evtData = web3.eth.abi.decodeParameters(['address', 'address', 'uint256', 'uint256', 'uint256', 'uint256'],eventData);   
                const srcToken = evtData[1];
                const srcAmount = evtData[3];
                if(!tokenPricesInUSD[srcToken]) {
                    if(srcToken==='0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE')
                        tokenPricesInUSD[srcToken] = await getEthPriceInUSD();
                    else
                        tokenPricesInUSD[srcToken] = await getExchangePrice(srcToken.toLowerCase(),'usd');  
                }   
                const divFactor = tokenDecimals[srcToken]==undefined ? 18 : tokenDecimals[srcToken];
                volumeInUSD+=(srcAmount/Math.pow(10,divFactor))*tokenPricesInUSD[srcToken];
                // console.log(srcToken, srcAmount, divFactor, volumeInUSD);
                }
            }
        }
        const ethPriceInUSD = tokenPricesInUSD['0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'] ? tokenPricesInUSD['0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'] : await getEthPriceInUSD();
        const volumeInEth=volumeInUSD/ethPriceInUSD;
        // console.log({usd:volumeInUSD, eth:volumeInEth});
        return { usd: volumeInUSD, eth: volumeInEth };
    }
    catch(err) {
        console.log(err);
    }
}

// Gets Oasis Transaction Volume in Past 24 hrs from Past Events
async function getOasisTransactVol() {
    try {
        let volumeInUSD=0;
        const latest = await web3.eth.getBlockNumber();
        const result = await oasisDex.getPastEvents('LogTrade',  { fromBlock: latest-10000, toBlock: latest});
        const now = new Date().valueOf();
        const yesterday = now - (24*60*60*1000);
        for(const evt of result) {
            // console.log(evt.returnValues);
            const block = await web3.eth.getBlock(evt.blockHash);
            const blockDate = block.timestamp*1000;     
            // console.log(new Date(blockDate));  
            if(blockDate>=yesterday && blockDate<=now) {
                const tx = await web3.eth.getTransaction(evt.transactionHash);       
                const id = await instaList.methods.accountID(tx.to).call();
                if(id!=0) {
                    const {pay_amt, pay_gem} = evt.returnValues;
                    if(!tokenPricesInUSD[pay_gem]) {
                        if(pay_gem==='0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE')
                            tokenPricesInUSD[pay_gem] = await getEthPriceInUSD();
                        else
                            tokenPricesInUSD[pay_gem] = await getExchangePrice(pay_gem.toLowerCase(),'usd');               
                    }
                    const divFactor = tokenDecimals[pay_gem]==undefined ? 18 : tokenDecimals[pay_gem]
                    volumeInUSD+=(pay_amt/Math.pow(10,divFactor))*tokenPricesInUSD[pay_gem];        
                }
            }
        }
        const ethPriceInUSD = tokenPricesInUSD['0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'] ? tokenPricesInUSD['0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'] : await getEthPriceInUSD();
        const volumeInEth=volumeInUSD/ethPriceInUSD;
        // console.log({usd:volumeInUSD, eth:volumeInEth});
        return { usd: volumeInUSD, eth: volumeInEth };
    }
    catch(err) {
        console.log(err);
    }
}