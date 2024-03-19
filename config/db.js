const mongoose = require('mongoose');
require('dotenv').config();

const connectDb = async () => {
    try {
        const uri = process.env.URL;
        if (!uri) {
            throw new Error("MongoDB connection URI is not defined in the environment variables.");
        }
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
};

module.exports = connectDb;
