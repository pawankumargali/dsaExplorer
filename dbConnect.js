const mongoose = require('mongoose');

function dbConnect(DB_URL) {
    const connectionOptions = { 
      useUnifiedTopology:true, 
      useNewUrlParser:true, 
      useCreateIndex:true,
      useFindAndModify:false,
      autoIndex: false
    };
    mongoose.connect(DB_URL, connectionOptions)
              .then(() => console.log('Connected to DB...'))
              .catch(err => console.log(`DB Connection Error: ${err}`));
}

module.exports = dbConnect;