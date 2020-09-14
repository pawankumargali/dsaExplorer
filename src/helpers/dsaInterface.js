import Web3 from 'web3';
import DSA from 'dsa-sdk';
import instaListContract from './instaListContract';
// const Web3=require('web3');
// const DSA=require('dsa-sdk');
// const instaListContract = require('./helpers/instaListContract');


// const WEB3_PROVIDER_URL='https://mainnet.infura.io/v3/8b1cb9c44d4a4c168674b43bfde366c9';
// const web3 =  new Web3(new Web3.providers.HttpProvider(WEB3_PROVIDER_URL));
const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/8d6142b291c84deba374beb2bf83834f'));
const dsa = new DSA(web3);
const instaList = new web3.eth.Contract(instaListContract.abi, instaListContract.address);

if(!web3) {
  console.log('Error with Provider Url');
}

// Function returns dsaId for given DSA address
async function getDsaAddressById(dsaId) {
  try {
    const address = await instaList.methods.accountAddr(dsaId).call();
    return address;
  }
  catch(err) {
    return '0x0000000000000000000000000000000000000000';
  }
}


// Function returns dsaId for given DSA address
async function getDsaIdByAddress(address) {
  try {
    const id = Number(await instaList.methods.accountID(address).call());
    if(isNaN(id) || id===0) return 0;
    return id;
  }
  catch(err) {
    return 0;
  }
}


// Function to get the total number of DSAs created

async function getGlobalDsaCount() {
    try {
      const count = await dsa.count();
      return count;
    }
    catch(err) {
      console.log(err);
    }
  }

// Function to get all accounts owned by an address
async function getAccounts(ownerAddress) {
  try {
    const accounts = await dsa.getAccounts(ownerAddress);
    return accounts;
  }
  catch(err) {
    // console.log(err);
    return [];
  }
}

// Function to get all the authorised address(es) of a DSA by address.
async function getAuthorizedAddresses(dsaAddress) {
  try {
    const accounts = await dsa.getAuthByAddress(dsaAddress);
    return accounts;
  }
  catch(err) {
    console.log(err);
    return -1;
  }
}


async function getBalances(address) {
  try {
    const balances = await dsa.balances.getBalances(address, 'token');
    return balances;
  }
  catch(err) {
    console.log(err);
  }
}


// Function to get compound position
async function getCompoundPosition(address) {
  try {
    
    const position = await dsa.compound.getPosition(address,'token');
    // console.log(position);
    return position;
  }
  catch(err) {
    console.log(err);
  }
}

// Function to get MKR position
async function getMakerPosition(address) {
  try {
    const position = await dsa.maker.getVaults(address);
    return position;
  }
  catch(err) {
    console.log(err);
  }
}

// Function to get Aave Position 
async function getAavePosition(address) {
  try{
    const position = await dsa.aave.getPosition(address, 'token');
    return position;
  }
  catch(err) {
    console.log(err);
  }
}


// Function to get dYdX position
async function getDydxPosition(address) {
  try{
    const position = await dsa.dydx.getPosition(address, 'token');
    return position;
  }
  catch(err) {
    console.log(err);
  }
}

export { getDsaAddressById, getDsaIdByAddress, getGlobalDsaCount, getAccounts, getAuthorizedAddresses, getBalances, getCompoundPosition, getMakerPosition, getAavePosition, getDydxPosition };