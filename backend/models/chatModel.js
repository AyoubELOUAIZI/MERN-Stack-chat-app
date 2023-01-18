const mongoose = require("mongoose");

// Create a new Mongoose schema for the Chat model
const chatModel = mongoose.Schema(
    {
        // Define a chatName field as a string that is trimmed before saving
        chatName: { type: String, trim: true },
        // Define a isGroupChat field as a boolean with a default value of false
        isGroupChat: { type: Boolean, default: false },
        // Define a users field as an array of ObjectIds that reference the User model
        users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        // Define a latestMessage field as an ObjectId that references the Message model
        latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
        // Define a groupAdmin field as an ObjectId that references the User model
        groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    // Add timestamp fields for the createdAt and updatedAt fields
    { timestamps: true }
);

// Create a Mongoose model for the Chat collection
const Chat = mongoose.model("Chat", chatModel);

// Export the Chat model to be used in other parts of the application
module.exports = Chat;



//chatName
//isGroupChat
//users
//latestMessage