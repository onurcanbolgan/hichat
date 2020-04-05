const mongoose = require('mongoose');

module.exports = () => {
    mongoose.connect(process.env.DB_STRING, { useNewUrlParser: true, useFindAndModify:false });
    mongoose.connection.on('open', () => {
        console.log('MongoDB: Conencted');
    });
    mongoose.connection.on('error', () => {
        console.log('MongoDB: Failed');
    });
    mongoose.Promise = global.Promise;
};