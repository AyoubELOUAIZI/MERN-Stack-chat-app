const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
    {
        name: { type: "String", required: true },
        email: { type: "String", unique: true, required: true },
        password: { type: "String", required: true },
        pic: {
            type: "String",
            required: true,
            default: "../images/avatar-icon.jpg"
        }
    },
    { timestaps: true }
);


const User = mongoose.model("User", userSchema);

module.exports = User;


