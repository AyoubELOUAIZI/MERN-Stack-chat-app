const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        //the option part
        // , {
        // useNewUrlParser: true,
        // useUnifiedTopology: true
        // }
        console.log("\n\n-------------------------------------------------------------");
        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
        console.log("-------------------------------------------------------------");
    } catch (error) {
        console.log("\n\n-------------------------------------------------------------");
        console.log(`Error: ${error.message}`.red.bold);
        console.log("-------------------------------------------------------------");
        process.exit();
    }
};

module.exports = connectDB;