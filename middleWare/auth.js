const { DSA_API_KEY } = require('../config');

exports.isAuth = function(req, res, next) {
    const { key } = req.query;
    if(!key) 
        return res.status(400).json({success:false, error:'API key missing in query string'});
    if(key!==DSA_API_KEY) 
        return res.status(400).json({success:false, error:'Invalid API key'});
    return next();
}
