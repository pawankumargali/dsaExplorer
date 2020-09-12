const Web3 = require('web3');
const { instaEventContract } = require('../contracts/instaDappContracts');
const { WEB3_PROVIDER_URL } = require('../config');

const web3 = new Web3(new Web3.providers.HttpProvider(WEB3_PROVIDER_URL));
const instaEvent = new web3.eth.Contract(instaEventContract.abi, instaEventContract.address);

const Tx = require('../models/Tx');

// Function to update Transactions in DSA
async function updateTxs() {
    try {
        const txInfo=[];
        const isTxCovered = {};
        const latest = await web3.eth.getBlockNumber();
        let { blockNumber: startBlock } = await Tx.findOne({}).sort({blockNumber: -1});
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
        // console.log(txInfo.length);
        while(txInfo.length!==0) {
            const {hash, dsaId} = txInfo.pop();
            const doc = await Tx.findOne({hash});
            if(!doc) {
                const receipt = await web3.eth.getTransactionReceipt(hash);
                if(receipt && receipt.status) {
                    const { from, to, gasUsed:gas, blockNumber, blockHash } = receipt;
                    const { timestamp } = await web3.eth.getBlock(blockHash); 
                    const newTx = new Tx({hash, dsaId, from, to, gas, blockNumber, timestamp});
                    await newTx.save();
                    // console.log(timestamp);
                }
            }
        }
        // console.log('Done');
    }
    catch(err) {
        console.log(err);
    }
}

module.exports = updateTxs;