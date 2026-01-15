const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://vichevong1_db_user:I0kUgcKj1EmsxxIW@cafepos.adiu7ac.mongodb.net/',

        console.log('MongoDB connected successfully'));
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1);
    }   
};

module.exports = connectDB;
