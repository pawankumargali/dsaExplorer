const mongoose = require('mongoose');

const recentTxSchema = new mongoose.Schema({
    hash: {
        type: String,
        required: true
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

recentTxSchema.index({blockNumber:-1, timestamp:1});

const RecentTx = mongoose.model('RecentTx', recentTxSchema);


module.exports = RecentTx;