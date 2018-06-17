var mongoose = require("mongoose");

// Define Campground schema
var CampgroundSchema = mongoose.Schema({
    name: String,
    image: String,
    description: String,
    price: Number,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});
// Create Campground model
module.exports = mongoose.model("Campground", CampgroundSchema);