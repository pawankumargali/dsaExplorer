require('dotenv').config({path: __dirname + '/.env'});

const { PORT, DB_URL, WEB3_PROVIDER_URL, CREATION_COUNT_OBJ_ID, TX_VOL_OBJ_ID, DSA_API_KEY } = process.env;

module.exports = { 
    PORT, 
    DB_URL, 
    WEB3_PROVIDER_URL, 
    CREATION_COUNT_OBJ_ID, 
    TX_VOL_OBJ_ID, 
    DSA_API_KEY 
};

