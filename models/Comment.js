var mongoose = require("mongoose");

// Create the Schema
var commentSchema = mongoose.Schema({
    text: String,
    author: String
});
// Export the data for importing into another file
module.exports = mongoose.model("Comment", commentSchema);