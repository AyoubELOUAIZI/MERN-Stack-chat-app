const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");


//--------------------------------------------1---------------------------------------------//
//@description     Create or fetch One to One Chat
//@route           POST /api/chat/
//@access          Protected
const accessChat = asyncHandler(async (req, res) => {
    //the userId of the one that user want to chat with
    //means the loggedin user will send us userid that he wants to chat with
    const { userId } = req.body;

    //Checking if userId is present in the request body
    if (!userId) {
        //Logging message to the console
        console.log("UserId param not sent with request");
        //Sending a response with status code 400 (Bad Request)
        return res.sendStatus(400);
    }

    //---------------------------------//
    // Find a single chat document where the following conditions are met:
    // 1. isGroupChat is set to false
    // 2. Users field contains the current user's ID and the other user's ID
    var isChat = await Chat.find({
        isGroupChat: false, // condition 1
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } }, // condition 2a
            { users: { $elemMatch: { $eq: userId } } }, // condition 2b
        ],
    })
        // Replace the "users" field with the corresponding user documents
        // but exclude the "password" field from the returned documents
        .populate("users", "-password")
        // Replace the "latestMessage" field with the corresponding message document
        .populate("latestMessage");

    //---------------------------------//
    isChat = await User.populate(isChat, {
        // The path parameter specifies the field that should be populated.
        // In this case, it is "latestMessage.sender"
        path: "latestMessage.sender",
        // The select parameter specifies which fields from the user document should be included in the population
        // In this case, it is only selecting the "name", "pic" and "email" fields.
        select: "name pic email",
    });

    //---------------------------------//
    // Check if a chat between the current user and the other user already exists
    if (isChat.length > 0) {
        // If it does, send the first chat in the result to the client //at the end it is only one chat yeh
        res.send(isChat[0]);
    } else {
        // If it doesn't, create a new chat object with the following properties:
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
        };

        try {
            // Use the Chat.create() method to create a new chat document with the chatData object
            const createdChat = await Chat.create(chatData);
            // Retrieve the newly created chat document and populate the "users" field with the corresponding user documents
            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate("users", "-password");
            // Send the fully populated chat document back to the client with a status of 200 (success)
            res.status(200).json(FullChat);
        } catch (error) {
            // If an error occurs while creating the new chat document, send a status of 400 (bad request) and throw the error message
            res.status(400);
            throw new Error(error.message);
        }
    }

});

//------------------------------------------2-----------------------------------------------//
//@description     Fetch all chats for a user
//@route           GET /api/chat/
//@access          Protected
const fetchChats = asyncHandler(async (req, res) => {
    try {
        //Find chats where the current user is included in the "users" array
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            //Populate the "users" field and exclude the "password" field
            .populate("users", "-password")
            //Populate the "groupAdmin" field and exclude the "password" field
            .populate("groupAdmin", "-password")
            //Populate the "latestMessage" field
            .populate("latestMessage")
            //Sort the results by the "updatedAt" field in descending order
            .sort({ updatedAt: -1 })
            .then(async (results) => {
                //Populate the "sender" field of the "latestMessage" field with the "name", "pic", and "email" fields
                results = await User.populate(results, {
                    path: "latestMessage.sender",
                    select: "name pic email",
                });
                //Send the results as a response with a status code of 200
                res.status(200).send(results);
            });
    } catch (error) {
        //If an error occurs, set the status code to 400
        res.status(400);
        //Throw an error with the message of the caught error
        throw new Error(error.message);
    }
});

//------------------------------------------3-----------------------------------------------//
//@description     Create New Group Chat
//@route           POST /api/chat/group
//@access          Protected
// Create a new group chat
const createGroupChat = asyncHandler(async (req, res) => {
    // Check if the required fields are present in the request body
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please Fill all the feilds" });
    }

    // Parse the 'users' field as JSON
    var users = JSON.parse(req.body.users);

    // Check if there are at least 2 users
    if (users.length < 2) {
        return res.status(400).send("More than 2 users are required to form a group chat");
    }

    // Add the authenticated user to the list of users
    users.push(req.user);

    try {
        // Create a new group chat
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        });

        // Find the created chat and populate the 'users' and 'groupAdmin' fields
        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        // Send the fully populated group chat as a JSON response
        res.status(200).json(fullGroupChat);
    } catch (error) {
        // Handle errors
        res.status(400);
        throw new Error(error.message);
    }
});

//---------------------------------------------4--------------------------------------------//
// @desc    Rename Group
// @route   PUT /api/chat/rename
// @access  Protected
const renameGroup = asyncHandler(async (req, res) => {
    // Destructure the chatId and chatName from the request body
    const { chatId, chatName } = req.body;

    // Use the Mongoose method findByIdAndUpdate to update the chat document with the new name
    // Use the new option to return the updated document
    // Use the populate method to populate the users and groupAdmin fields with the corresponding user documents
    // Use the "-password" parameter to exclude the password field from the populated user documents
    const updatedChat = await Chat.findByIdAndUpdate(chatId, { chatName: chatName }, { new: true, })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    // Check if the chat was found
    if (!updatedChat) {
        // If not, set the status to 404 and throw an error
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        // If found, return the updated chat and set the status to 200
        res.status(200).json(updatedChat);
    }
});


//----------------------------------------------5-------------------------------------------//
// @desc    Add user to Group / Leave
// @route   PUT /api/chat/groupadd
// @access  Protected
const addToGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    // check if the requester is admin

    const added = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push: { users: userId },
        },
        {
            new: true,
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!added) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.json(added);
    }
});

//------------------------------------------6-----------------------------------------------//

// @desc    Remove user from Group
// @route   PUT /api/chat/groupremove
// @access  Protected
const removeFromGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    // check if the requester is admin  //how ?????is from the toke??

    const removed = await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull: { users: userId },
        },
        {
            new: true,
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!removed) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.json(removed);
    }
});
//-----------------------------------------------------------------------------------------//


module.exports = {
    accessChat,
    fetchChats,
    createGroupChat,
    renameGroup,
    addToGroup,
    removeFromGroup,
};