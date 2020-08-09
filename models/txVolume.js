const mongoose = require('mongoose');

const txVolumeSchema = new mongoose.Schema({
    curveSusd : {
        type: Number,
        required: true
    },
    curveSbtc: {
        type: Number,
        required: true
    },
    curveY: {
        type: Number,
        required: true
    },
    kyber: {
        type: Number,
        required: true
    },
    uniswap: {
        type: Number,
        required: true
    },
    oneInch: {
        type: Number,
        required: true
    },
    oasis: {
        type: Number,
        required: true
    }
});

const TxVolume = mongoose.model('TxVolume', txVolumeSchema);

module.exports = TxVolume;