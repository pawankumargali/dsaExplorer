const Web3 = require('web3');
const { instaEventContract } = require('../contracts/instaDappContracts');
const { WEB3_PROVIDER_URL } = require('../config');

const web3 = new Web3(new Web3.providers.HttpProvider(WEB3_PROVIDER_URL));
const instaEvent = new web3.eth.Contract(instaEventContract.abi, instaEventContract.address);

const Tx = require('../models/Tx');

// console.log(WEB3_PROVIDER_URL);

// Function to update Transactions in DSA
async function updateTxs() {
    try {
        const txInfo=[];
        const isTxCovered = {};
        const latest = await web3.eth.getBlockNumber();
        let startBlock=9700000;
        // let { blockNumber: latest } = await Tx.findOne({}).sort({blockNumber: 1});
        // console.log(latest);
        while(startBlock<=latest) {
            console.log(startBlock);
            const result = await instaEvent.getPastEvents('LogEvent', { fromBlock:startBlock, toBlock: startBlock+10000});
            for(const evt of result) {
                const hash = evt.transactionHash;
                const { accountID } = evt.returnValues;
                if(!isTxCovered[hash]) {
                    isTxCovered[hash] = true;
                    txInfo.push({hash, dsaId:accountID});
                }
            }
            startBlock+= (startBlock+10000>latest) ? (latest) : (10000);
        }
        console.log(txInfo.length);

        while(txInfo.length!==0) {
            const {hash, dsaId} = txInfo.pop();
            const doc = await Tx.findOne({hash});
            if(!doc) {
                const receipt = await web3.eth.getTransactionReceipt(hash);
                if(receipt && receipt.status) {
                    const { from, to, gasUsed:gas, blockNumber, blockHash } = receipt;
                    const { timestamp } = await web3.eth.getBlock(blockHash); 
                    await Tx.create({hash, dsaId, from, to, gas, blockNumber, timestamp}) 
                    // const newTx = new Tx({hash, from, to, gas, blockNumber, timestamp});
                    // await newTx.save();
                    // console.log(newTx);
                    }
            }
        }
        console.log('Done');
    }
    catch(err) {
        console.log(err);
    }
}


// async function deleteOlderTxs(TxCountLimitInDB) {
//     const count = await RecentTx.countDocuments();
//     const delCount=count-TxCountLimitInDB;
//     if(delCount<=0) return;
//     const docs = await RecentTx.find({}).sort({ timestamp: 1}).limit(delCount);
//     const idsToDel = [];
//     for(const doc of docs) {
//         idsToDel.push(doc._id);
//     }
//     await RecentTx.deleteMany({ _id: { $in: idsToDel } });
// }

  module.exports = updateTxs;