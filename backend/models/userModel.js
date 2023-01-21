const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
    {
        name: { type: "String", required: true },
        email: { type: "String", unique: true, required: true },
        password: { type: "String", required: true },
        pic: {
            type: "String",
            // required: true,
            default: "../images/avatar-icon.jpg"
        }
    },
    { timestaps: true }
);

//''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''//
// This method takes an enteredPassword as an argument and compares it 
// to the password field on the current user instance using the bcrypt 
// library's compare method. It returns the result of the comparison as
//  a boolean value (true if the passwords match, false if they do not).
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}
// This method can be used to check if the entered password by the user matches the hashed
//  password in the database when the user is trying to log in.

//''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''//
userSchema.pre("save", async function (next) {
    //Check if the password field is modified
    if (!this.isModified) {
        next();
    }

    //Generate a salt for the password
    const salt = await bcrypt.genSalt(10);
    //Hash the password using the salt
    this.password = await bcrypt.hash(this.password, salt);
    //Proceed to the next middleware
    next();
});

// You can see that the code is setting up a middleware function that runs before
//  a "save" operation on a Mongoose schema, specifically on the userSchema.
//''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''//

const User = mongoose.model("User", userSchema);

module.exports = User;


