const mongoose = require('mongoose');

const txVolumeSchema = new mongoose.Schema({
    curveSusd : {
        usd: {
            type: Number,
            required: true
        },
        eth: {
            type: Number,
            required: true
        }
    },
    curveSbtc: {
        usd: {
            type: Number,
            required: true
        },
        eth: {
            type: Number,
            required: true
        }
    },
    curveY: {
        usd: {
            type: Number,
            required: true
        },
        eth: {
            type: Number,
            required: true
        }
    },
    kyber: {
        usd: {
            type: Number,
            required: true
        },
        eth: {
            type: Number,
            required: true
        }
    },
    uniswap: {
        usd: {
            type: Number,
            required: true
        },
        eth: {
            type: Number,
            required: true
        }
    },
    oneInch: {
        usd: {
            type: Number,
            required: true
        },
        eth: {
            type: Number,
            required: true
        }
    },
    oasis: {
        usd: {
            type: Number,
            required: true
        },
        eth: {
            type: Number,
            required: true
        }
    }
});

const TxVolume = mongoose.model('TxVolume', txVolumeSchema);

module.exports = TxVolume;