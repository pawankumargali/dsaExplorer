const Web3 = require('web3');
const { instaEventContract } = require('../contracts/instaDappContracts');
const { WEB3_PROVIDER_URL } = require('../config');

const web3 = new Web3(new Web3.providers.HttpProvider(WEB3_PROVIDER_URL));
const instaEvent = new web3.eth.Contract(instaEventContract.abi, instaEventContract.address);

const RecentTx = require('../models/recentTx');

// console.log(WEB3_PROVIDER_URL);

// Function to get Latest Transactions in DSA
async function updateLatestTxs(maxNumOfTxs) {
    try {
        const txHashes=[];
        const isTxCovered = {};
        const latest = await web3.eth.getBlockNumber();
        let { blockNumber: startBlock } = await RecentTx.findOne({}).sort({blockNumber: -1});
        while(startBlock<=latest) {
            const result = await instaEvent.getPastEvents('LogEvent', { fromBlock: startBlock, toBlock: latest});
            for(const evt of result) {
                const hash = evt.transactionHash;
                if(!isTxCovered[hash]) {
                    isTxCovered[hash] = true;
                    txHashes.push(hash);
                }
            }
            startBlock+= (startBlock+10000>latest) ? (latest) : (startBlock+10000);
        }

        let txCount=0;
        while(txHashes.length!==0) {
            if(txCount==maxNumOfTxs) break;
            const hash = txHashes.pop();
            const receipt = await web3.eth.getTransactionReceipt(hash);
            if(receipt && receipt.status) {
                const doc = await RecentTx.findOne({hash});
                if(!doc) {
                    const { from, to, gasUsed:gas, blockNumber, blockHash } = receipt;
                    const { timestamp } = await web3.eth.getBlock(blockHash);  
                    const newTx = new RecentTx({hash, from, to, gas, blockNumber, timestamp});
                    await newTx.save();
                    txCount+=1;
                    // console.log(blockNumber);
                }
            }
        }
    }
    catch(err) {
        console.log(err);
    }
}


async function deleteOlderTxs(TxCountLimitInDB) {
    const count = await RecentTx.countDocuments();
    const delCount=count-TxCountLimitInDB;
    if(delCount<=0) return;
    const docs = await RecentTx.find({}).sort({ timestamp: 1}).limit(delCount);
    const idsToDel = [];
    for(const doc of docs) {
        idsToDel.push(doc._id);
    }
    await RecentTx.deleteMany({ _id: { $in: idsToDel } });
}

  module.exports =  { updateLatestTxs, deleteOlderTxs };