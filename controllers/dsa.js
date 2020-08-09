const CreationCount = require('../models/creationCount');
const TxVolume = require('../models/txVolume');

exports.getCreationCount =async function(req, res) {
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

