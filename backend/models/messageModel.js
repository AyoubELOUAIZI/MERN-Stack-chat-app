const mongoose = require("mongoose");

// Creating a new Mongoose schema for the Message model
const messageSchema = mongoose.Schema(
    {
        // Field for the sender of the message, stored as a reference to a User document
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        // Field for the message content, stored as a string
        content: { type: String, trim: true },
        // Field for the chat the message belongs to, stored as a reference to a Chat document
        chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
        // Field for the users that have read the message, stored as an array of references to User documents
        readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
    // Setting for automatic creation and update timestamps
    { timestamps: true }
);

// Creating a Mongoose model for the Message schema
const Message = mongoose.model("Message", messageSchema);

// Exporting the Message model for use in other parts of the application
module.exports = Message; 
