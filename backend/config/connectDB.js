const mongoose = require('mongoose');
require('dotenv').config()
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log(`Mongodb connected ${mongoose.connection.host}`);
    } catch (err) {
        console.log(`Mongodb Server Issue ${err}` );
    }
}

module.exports = connectDB;