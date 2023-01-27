const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
//----------------------------------------third function-------------------------------------------//
//@description     Get or Search all users
//@route           GET /api/user?search=
//@access          Public
const allUsers = asyncHandler(async (req, res) => {
    
    //instead of using param we use query you can check that by printing the req //
    console.log(req.query.search);

    // check if the search query is present in the request
    const keyword = req.query.search
        ? {
            // if present, construct a query to search for users
            // whose name or email match the search criteria using regular expression
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } },
            ],
        }
        : {};
    console.log(keyword)

    //find the user by executing the query on the `User` model
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    //send the result to the client in the response
    res.send(users);
});


//-------------------------------------------------first function-----------------------------------------//
//@description     Register new user
//@route           POST /api/user/
//@access          Public
const registerUser = asyncHandler(async (req, res) => {
    // Destructuring the request body to extract the values of name, email, password, and pic
    const { name, email, password, pic } = req.body;

    // Checking if any of the required fields is missing
    if (!name || !email || !password) {
        // If any of the fields is missing, set the response status to 400 (Bad Request)
        res.status(400);
        // Throw an error with a message
        throw new Error("Please Enter all the Feilds");
    }

    // Checking if a user with the same email already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        // If a user with the same email already exists, set the response status to 400 (Bad Request)
        res.status(400);
        // Throw an error with a message
        throw new Error("User already exists");
    }
    //if you get to this line means the user not exist yet all failed good
    // Creating a new user
    const user = await User.create({
        name,
        email,
        password,
        pic,
    });

    if (user) {
        // If the user was created successfully, set the response status to 201 (Created) and return the user's information
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token: generateToken(user._id),
        });
    } else {
        // If the user was not created, set the response status to 400 (Bad Request)
        res.status(400);
        // Throw an error with a message
        throw new Error("failed to create the user");
    }
});
//---------------------------------------------------------------------------------------//
//@description     Auth the user
//@route           POST /api/users/login
//@access          Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error("Invalid Email or Password");
    }
});
//---------------------------------------------------------------------------------------//


module.exports = { allUsers, registerUser, authUser };