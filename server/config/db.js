const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            maxPoolSize: process.env.NODE_ENV === "production" ? 20 : 5,
            serverSelectionTimeoutMS: 5000,
            autoIndex: process.env.NODE_ENV !== "production",
        });
        // mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected");
    } catch (error) {
        console.error("DB Error:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;