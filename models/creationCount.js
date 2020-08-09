const mongoose = require('mongoose');

const creationCountSchema = new mongoose.Schema({
    data : {
        type: String,
        required: true
    },
    lastScannedBlock : {
        type: Number,
        required: true
    }
})

const CreationCount = mongoose.model('CreationCount', creationCountSchema);

module.exports = CreationCount;