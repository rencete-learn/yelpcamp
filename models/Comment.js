var mongoose = require("mongoose");

// Create the Schema
var commentSchema = mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

// Export the data for importing into another file
module.exports = mongoose.model("Comment", commentSchema);