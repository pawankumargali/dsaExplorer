const CoinGecko = require('coingecko-api');

const CoinGeckoClient = new CoinGecko();


// Get Exchange price of token vs currency
async function getExchangePrice(tokenAddress, vsCurrency) {
    try {
        const { data } = await CoinGeckoClient.simple.fetchTokenPrice({
            contract_addresses: tokenAddress,
            vs_currencies: vsCurrency,
        });
        return data[tokenAddress].usd;
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

module.exports = { getExchangePrice, getEthPriceInUSD };


