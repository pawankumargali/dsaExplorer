// IMPORTS
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dbConnect = require('./dbConnect');
const updateDsaCreationCount = require('./scripts/updateDsaCreationCount');
const updateTxVolumes = require('./scripts/updateTxVolumes');
const { updateLatestTxs, deleteOlderTxs } = require('./scripts/updateRecentTxs');
const { PORT, DB_URL, DB_TX_COUNT_LIMIT } = require('./config');

// SERVER SETUP
const app = express();
app.listen(PORT, err => {
    if(err) 
        console.log(`Server Connection Error: ${err}`);
    else
        console.log(`Listening on Port ${PORT}...`);
});

// Index Page Redirect to Documentation
app.get('/', (req, res) => res.redirect('https://documenter.getpostman.com/view/10301892/T1LJk8xS?version=latest'));

// DB CONNECTION
dbConnect(DB_URL);

// APP MIDDLEWARE
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());

// APP ROUTES MIDDLEWARE
const dsaRouter = require('./routes/dsa');
const updateRecentTxs = require('./scripts/updateRecentTxs');
app.use('/api/dsa', dsaRouter);



// DATABASE UPDATERS

// Updates Recent Transactions every 10mins
const recentTxTimeInterval=1000*60*5;
setInterval(async () => {
    try {
        await updateLatestTxs(DB_TX_COUNT_LIMIT);
        await deleteOlderTxs(DB_TX_COUNT_LIMIT);
    }
    catch(err) {
        console.log(err);
    }
}, recentTxTimeInterval);

// Updates 24hr Transaction Vol through Dexes every 2 hours
const txVolTimeInterval = 1000*60*60*1;
setInterval(async () => {
    try {
        await updateTxVolumes();
    }
    catch(err) {
        console.log(err);
    }
}, txVolTimeInterval);

// Updates DSA Creation Count every 6 hours
const creationCountTimeInterval = 1000*60*60*6;
setInterval(async () => {
    try {
        await updateDsaCreationCount();
    }
    catch(err) {
        console.log(err);
    }
}, creationCountTimeInterval); 
