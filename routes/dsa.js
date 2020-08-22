const router = require('express').Router();
const { getCreationCount, getTxVolume, getRecentTxs } = require('../controllers/dsa');
const { isAuth } = require('../middleWare/auth');
const { validateRecentTxQueryParams } = require('../middleWare/inputValidation');
 
router.get('/creation/counts', isAuth, getCreationCount);
router.get('/tx/volume', isAuth, getTxVolume);
router.get('/tx/recent', isAuth, validateRecentTxQueryParams, getRecentTxs);

module.exports=router;