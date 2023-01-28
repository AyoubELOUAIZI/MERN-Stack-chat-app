const express = require("express");
const {
    accessChat,
    fetchChats,
    createGroupChat,
    removeFromGroup,
    addToGroup,
    renameGroup,
} = require("../controllers/chatControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Setting up a route for POST request to the root route
// and using the protect middleware and the accessChat function
router.route("/").post(protect, accessChat);

// Setting up a route for GET request to the root route
// and using the protect middleware and the fetchChats function
router.route("/").get(protect, fetchChats);

// Setting up a route for POST request to the /group route
// and using the protect middleware and the createGroupChat function
router.route("/group").post(protect, createGroupChat);

// Setting up a route for PUT request to the /rename route
// and using the protect middleware and the renameGroup function
router.route("/rename").put(protect, renameGroup);

// Setting up a route for PUT request to the /groupremove route
// and using the protect middleware and the removeFromGroup function
router.route("/groupremove").put(protect, removeFromGroup);

// Setting up a route for PUT request to the /groupadd route
// and using the protect middleware and the addToGroup function
router.route("/groupadd").put(protect, addToGroup);

// Exporting the router so that it can be used in the main application
module.exports = router;
