const Web3 = require('web3');
const { instaListContract } = require('../contracts/instaDappContracts');
const { WEB3_PROVIDER_URL } = require('../config');

const web3 = new Web3(new Web3.providers.HttpProvider(WEB3_PROVIDER_URL));
const instaList = new web3.eth.Contract(instaListContract.abi, instaListContract.address);

exports.getDsaIdByAddress = async function getDsaIdByAddress(address) {
    const id = await instaList.methods.accountID(address).call();
    return id;
}



