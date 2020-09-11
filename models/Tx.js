const mongoose = require('mongoose');

const txSchema = new mongoose.Schema({
    hash: {
        type: String,
        required: true
    },
    dsaId: {
        type:Number,
        required:true
    },
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    gas: {
        type: Number,
        required: true
    },
    blockNumber: {
        type: Number,
        required: true,
    },
    timestamp: {
        type: Number,
        required: true,
    }
});

txSchema.index({dsaId:1, timestamp:-1});

const Tx = mongoose.model('Tx', txSchema);


module.exports = Tx;