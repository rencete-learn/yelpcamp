var mongoose = require("mongoose");
var Campground = require("./models/Campground"); // import Campground model
var Comment = require("./models/Comment"); // import Comment model
var campgroundsData = [
    { 
        name: "Starry Starry Night Camp",
        image: "https://images.unsplash.com/photo-1496425745709-5f9297566b46?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=b084690f83c5e63fafd161f8bc729a1f&auto=format&fit=crop&w=500&q=60",
        description: "Perfect for astronomy lessons or just staring at the wonderful night sky"
    },
    { 
        name: "Camp of the Fireflies",
        image: "https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        description: "Lots of insects but plenty of lights"
    },
    { 
        name: "Mount Bluelights",
        image: "https://images.pexels.com/photos/618848/pexels-photo-618848.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
        description: "Wonderful night sky and relaxing atmosphere"
    }
]

var seed = function() {
    Campground.remove({}, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Removed campgrounds");
            Comment.remove({}, (err) => {
                if(err) {
                    console.log(err);
                } else {
                    console.log("Removed comments");
                    campgroundsData.forEach((data) => {
                        Campground.create(data, (err, campground) => {
                            if(err) {
                                console.log(err);
                            }
                            else {
                                console.log("Added a campground");
                                Comment.create({
                                    text: "This place is great, but I wish there was internet",
                                    author: "Homer"
                                }, (err, comment) => {
                                    if(err) {
                                        console.log(err);
                                    } else {
                                        campground.comments.push(comment);
                                        campground.save();
                                        console.log("Created new comment");
                                    }
                                })
                            }
                        })
                    })
                }
            })
        }
    })
}

module.exports = seed;