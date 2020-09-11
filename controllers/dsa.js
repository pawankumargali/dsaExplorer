const CreationCount = require('../models/creationCount');
const TxVolume = require('../models/txVolume');
const Tx = require('../models/Tx');
const { getDsaIdByAddress } = require('../helpers/dsa');

exports.getCreationCount = async function(req, res) {
    try {
        const { data:dataStr } = await CreationCount.findById(process.env.CREATION_COUNT_OBJ_ID);
        const data = JSON.parse(dataStr);
        return res.status(200).json({success:true, data});
    }
    catch(err) {
        return res.status(500).json({success:false, error:err});
    }
}

exports.getTxVolume = async function(req, res) {
    try {
        const data = await TxVolume.findById(process.env.TX_VOL_OBJ_ID).select('-_id -__v');
        return res.status(200).json({success:true, data});
    }
    catch(err) {
        return res.status(500).json({success:false, error:err});
    }
}

exports.getRecentTxs = async function(req, res) {
    try{
        const limit  = req.query.limit ? Number(req.query.limit) : 100;
        const data = await Tx.find({}).sort({timestamp: -1}).select('-__v').limit(limit);
        console.log('Here');
        return res.status(200).json({success:true, data});
    }
    catch(err) {
        return res.status(500).json({success:false, error:err});
    }
}

exports.getRecentTxsByDsaId = async function(req, res) {
    try {
        const { dsaAddress } = req.params;
        console.log(dsaAddress, req.params);
        const dsaId = await getDsaIdByAddress(dsaAddress);
        if(!dsaId) return res.status(404).json({success:false, error:'Invalid address'})
        const limit = req.query.limit ? Number(req.query.limit) : 25;
        const data = await Tx.find({dsaId}).sort({timestamp:-1}).select('-__v').limit(limit);
        return res.status(200).json({success:true, data});
    }
    catch(err) {
        return res.status(500).json({success:false, error:err});
    }
}