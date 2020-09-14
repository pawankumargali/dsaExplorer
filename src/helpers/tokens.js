import batIcon from '../assets/img/tokens/bat.svg';
import busdIcon from '../assets/img/tokens/busd.svg';
import compIcon from '../assets/img/tokens/comp.svg';
import daiIcon from '../assets/img/tokens/dai.svg';
import ethIcon from '../assets/img/tokens/eth.svg';
import wethIcon from '../assets/img/tokens/weth.png';
import kncIcon from '../assets/img/tokens/knc.svg';
import lendIcon from '../assets/img/tokens/lend.svg';
import linkIcon from '../assets/img/tokens/link.svg';
import manaIcon from '../assets/img/tokens/mana.svg';
import mkrIcon from '../assets/img/tokens/mkr.svg';
import renbtcIcon from '../assets/img/tokens/renbtc.svg';
import repIcon from '../assets/img/tokens/rep.svg';
import sbtcIcon from '../assets/img/tokens/sbtc.svg';
import snxIcon from '../assets/img/tokens/snx.svg';
import susdIcon from '../assets/img/tokens/susd.svg';
import tusdIcon from '../assets/img/tokens/tusd.svg';
import usdcIcon from '../assets/img/tokens/usdc.svg';
import usdtIcon from '../assets/img/tokens/usdt.svg';
import wbtcIcon from '../assets/img/tokens/wbtc.svg';
import yfiIcon from '../assets/img/tokens/yfi.svg';
import zrxIcon from '../assets/img/tokens/zrx.svg';

const tokens = {
    bat: {
        address:'0x0d8775f648430679a709e98d2b0cb6250d2887ef',
        name:'Basic Attention Token',
        icon:batIcon,
        decimals:18
    },
    busd: {
        address:'0x4fabb145d64652a948d72533023f6e7a623c7c53',
        name:'Binance USD',
        icon: busdIcon,
        decimals:18
    },
    comp: {
        address:'0xc00e94cb662c3520282e6f5717214004a7f26888',
        name:'Compound',
        icon:compIcon,
        decimals:18
    },
    dai: {
        address:'0x6b175474e89094c44da98b954eedeac495271d0f',
        name:'Dai',
        icon:daiIcon,
        decimals:18,  
    },
    eth: {
        address:'0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        name:'Ether',
        icon:ethIcon,
        decimals:18
    },
    weth: {
        address:'0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        name:'Wrapped Ether',
        icon:wethIcon,
        decimals:18
    },
    knc: {
        address:'0xdd974d5c2e2928dea5f71b9825b8b646686bd200',
        name: 'Kyber Network Coin',
        knc:kncIcon,
        decimals:18
    },
    lend: {
        address:'0x80fB784B7eD66730e8b1DBd9820aFD29931aab03',
        name: 'EthLend',
        icon:lendIcon,
        decimals:18
    },
    link: {
        address:'0x514910771af9ca656af840dff83e8264ecf986ca',
        name:'ChainLink Token',
        icon:linkIcon,
        decimals:18
    },
    mana: {
        address:'0x0f5d2fb29fb7d3cfee444a200298f468908cc942',
        name:'Decentraland',
        icon:manaIcon,
        decimals:18
    },
    mkr: {
        address:'0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
        name:'Maker',
        icon:mkrIcon,
        decimals:18
    },
    renbtc: {
        address:'0xeb4c2781e4eba804ce9a9803c67d0893436bb27d',
        name:'renBTC',
        icon:renbtcIcon,
        decimals:8
    },
    rep: {
        address:'0x221657776846890989a759ba2973e427dff5c9bb',
        name:'Augur',
        icon:repIcon,
        decimals:18
    },
    sbtc: {
        address:'0xfe18be6b3bd88a2d2a7f928d00292e7a9963cfc6',
        name:'Synthetix BTC',
        icon:sbtcIcon,
        decimals:18
    },
    snx: {
        address:'0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f',
        name:'Synthetix Network Coin',
        icon:snxIcon,
        decimals:18
    },
    susd: {
        address:'0x57ab1ec28d129707052df4df418d58a2d46d5f51',
        name:'Synthetix USD',
        icon:susdIcon,
        decimals:18
    },
    tusd: {
        address:'0x0000000000085d4780B73119b644AE5ecd22b376',
        name:'TrueUSD',
        icon:tusdIcon,
        decimals:18
    },
    usdc: {
        address:'0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        name:'USD Coin',
        icon:usdcIcon,
        decimals:6
    },
    usdt: {
        address:'0xdac17f958d2ee523a2206206994597c13d831ec7',
        name:'Tether USD',
        icon:usdtIcon,
        decimals:6
    },
    wbtc: {
        address:'0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
        name:'Wrapped BTC',
        icon:wbtcIcon,
        decimals:8
    },
    yfi: {
        address:'0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e',
        name:'Yearn',
        icon:yfiIcon,
        decimals:18
    },
    zrx: {
        address:'0xe41d2489571d322189246dafa5ebde1f4699f498',
        name:'0x Protocol',
        icon:zrxIcon,
        decimals:18
    }
}

export default tokens;
// module.exports=tokens;