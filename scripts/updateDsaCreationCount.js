const Web3 = require('web3');
const { instaIndexContract } = require('../contracts/instaDappContracts');
const CreationCount = require('../models/creationCount');
const { WEB3_PROVIDER_URL, CREATION_COUNT_OBJ_ID } = require('../config');


const web3 = new Web3(new Web3.providers.HttpProvider(WEB3_PROVIDER_URL));
// InstaDApp Creation Event Contract
const instaIndex = new web3.eth.Contract(instaIndexContract.abi, instaIndexContract.address);


/* 
Updates DSA Creation Count 
Format:
{ 
    year : {
        count: yearTotal,
        month : {
            count: monthTotal,
            date1: val1,
            date2: val2 
        }
    }
}
*/
async function updateDsaCreationCount() {
    try {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const { data,  lastScannedBlock } = await CreationCount.findById(CREATION_COUNT_OBJ_ID);
        const accCreatedCount = JSON.parse(data);
        let startBlock = lastScannedBlock+1;
        const latest = await web3.eth.getBlockNumber();
        // console.log(startBlock, accCreatedCount);
        while(startBlock<=latest) {
            const endBlock = startBlock+10000>latest ? latest : startBlock+10000;
            const result = await instaIndex.getPastEvents('LogAccountCreated', { fromBlock: startBlock, toBlock: endBlock});
            startBlock+=10000;
            for(const evt of result) {
                const blockData = await web3.eth.getBlock(evt.blockHash);
                const day = new Date(blockData.timestamp*1000);
                const dd = day.getUTCDate();
                const mmm = months[day.getUTCMonth()];
                const yyyy = day.getUTCFullYear();
                if(!accCreatedCount[yyyy])
                    accCreatedCount[yyyy]={count:0};
                if(!accCreatedCount[yyyy][mmm]) 
                    accCreatedCount[yyyy][mmm] = {count:0};
                if(!accCreatedCount[yyyy][mmm][dd]) {
                    accCreatedCount[yyyy][mmm][dd]=1;
                    accCreatedCount[yyyy].count+=1;
                    accCreatedCount[yyyy][mmm].count+=1;
                }
                else {
                    accCreatedCount[yyyy][mmm][dd]+=1;
                    accCreatedCount[yyyy].count+=1;
                    accCreatedCount[yyyy][mmm].count+=1;
                }
                // console.log(accCreatedCount);
            }
        }
        const countStr =  JSON.stringify(accCreatedCount);
        await CreationCount.findByIdAndUpdate( CREATION_COUNT_OBJ_ID, {data:countStr, lastScannedBlock:latest}, {new:true, upsert:true});
        // console.log(result);
    }
    catch(err) {
        console.log(err);
    }
}

module.exports = updateDsaCreationCount;