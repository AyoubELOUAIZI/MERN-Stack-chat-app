const jwt = require("jsonwebtoken"); // import jsonwebtoken library for decoding jwt tokens
const User = require("../models/userModel.js"); // import user model for querying user data
const asyncHandler = require("express-async-handler"); // import async handler for handling asynchronous code

const protect = asyncHandler(async (req, res, next) => {
    let token;

    // check if the request has an authorization header that starts with "Bearer"
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1]; // extract the token from the authorization header

            //decodes token id
            const decoded = jwt.verify(token, process.env.JWT_SECRET); // decode the token using the JWT_SECRET from the environment variables

            req.user = await User.findById(decoded.id).select("-password"); // query the user data based on the decoded id and exclude the password

            next(); // continue with the next middleware or route handler
        } catch (error) {
            res.status(401); // set the response status to 401 - Unauthorized
            throw new Error("Not authorized, token failed"); // throw an error message
        }
    }
    
    // if no token is found in the request
    if (!token) {
        res.status(401); // set the response status to 401 - Unauthorized
        throw new Error("Not authorized, no token"); // throw an error message
    }
});

module.exports = { protect }; 
