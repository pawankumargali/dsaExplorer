// IMPORTS
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dbConnect = require('./dbConnect');
const updateDsaCreationCount = require('./scripts/updateDsaCreationCount');
const updateTxVolumes = require('./scripts/updateTxVolumes');
const { PORT, DB_URL } = require('./config');

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
app.use('/api', dsaRouter);


// Updates 24hr Transaction Vol through Dexes every 30 mins
const txVolTimeInterval = 1000*60*30;
setInterval(async () => {
    try {
        await updateTxVolumes();
    }
    catch(err) {
        console.log(err);
    }
}, txVolTimeInterval);

// Updates DSA Creation Count every 1 hour
const creationCountTimeInterval = 1000*60*60;
setInterval(async () => {
    try {
        await updateDsaCreationCount();
    }
    catch(err) {
        console.log(err);
    }
}, creationCountTimeInterval); 