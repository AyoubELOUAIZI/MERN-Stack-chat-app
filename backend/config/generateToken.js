const jwt = require("jsonwebtoken"); // requiring jsonwebtoken library

const generateToken = (id) => {
    // using jsonwebtoken's sign method to generate a token
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        // setting token expiration to 30 days
        expiresIn: "30d",
    });
};

module.exports = generateToken; // Exporting the function to be used in other parts of the application


// This code imports the jsonwebtoken library and defines a function generateToken
//  that takes the user's id as an argument and generates a token based on that.
//   It uses the jsonwebtoken library's sign() method to generate the token.
//   The first argument passed to the sign() method is an object that contains the user's id, 
//   the second argument is the secret key used to sign the token and this key should be stored 
//   in environment variable so that it can be used in a production environment. The third argument 
//   is an options object that specifies the token's expiration time in seconds.In this case,
//    it is set to 30 days.Finally, the function is exported so it can be used in other parts of the application.