const router = require('express').Router();
const { getCreationCount, getTxVolume } = require('../controllers/dsa');
const { isAuth } = require('../middleWare/auth');
 
router.get('/dsa/creationCount', isAuth, getCreationCount);
router.get('/dsa/txVolume', isAuth, getTxVolume);

module.exports=router;