const mongoose = require("mongoose");

const MONGO_URI = "mongodb+srv://sujal701:Sujal701@test1.qic7t1p.mongodb.net/test1?retryWrites=true&w=majority&appName=test1";

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1); // Exit if DB connection fails
    }
};

module.exports = { connectDB };
