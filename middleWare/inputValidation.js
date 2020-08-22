exports.validateRecentTxQueryParams = function(req, res, next) {
    const { limit } = req.query;
    if(limit && isNaN(Number(limit))) {
        console.log(limit);
        console.log(typeof(limit));
        return res.status(400).json({success:false, error:'Limit Param needs to be an integer'});
    }
    return next();
}