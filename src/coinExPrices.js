import axios from 'axios';
import CoinGecko from 'coingecko-api';
import tokens from './tokens';

const CoinGeckoClient = new CoinGecko();

// Get Exchange price of token vs usd
async function getTokenPriceInUSD(tokenAddress) {
    try {
        const address=tokenAddress.toLowerCase();
        const { data } = await CoinGeckoClient.simple.fetchTokenPrice({
            contract_addresses: address,
            vs_currencies: 'usd',
        });
        return data[address].usd;
    }
    catch(err) {
        console.log(err);
    }
}

// Get Exchange price of supported tokens vs usd (For displaying Balances)
async function getSupportedTokenPricesInUSD() {
    try {
        const addresses=[];
        const prices={};
        prices['eth'] = await getEthPriceInUSD();
        for(const token in tokens) {
            if(token!=='eth') {
                const address = tokens[token].address.toLowerCase();
                addresses.push(address);
            }
        }
        const { data } = await CoinGeckoClient.simple.fetchTokenPrice({
            contract_addresses: [...addresses],
            vs_currencies: 'usd',
        });
        for(const token in tokens) {
            const address = tokens[token].address.toLowerCase();
            if(token!=='eth')
                prices[token] = data[address].usd;
        }
        // console.log(prices);
        return prices;

    }
    catch(err) {
        console.log(err);
    }
}


// Get Exchange price of ethereum vs usd
async function getEthPriceInUSD() {
    try {
        const { data } = await CoinGeckoClient.simple.price({
            ids: 'ethereum',
            vs_currencies:'usd',
        });
        const ethPriceInUSD = data['ethereum'].usd;
        return ethPriceInUSD;
    }
    catch(err) {
        console.log(err);
    }
}

export { getTokenPriceInUSD, getEthPriceInUSD, getSupportedTokenPricesInUSD };