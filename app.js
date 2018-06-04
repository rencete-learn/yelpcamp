// Use express web application framework
var express = require("express");
var app = express();

// Identify public folders for common assets like scripts and css
app.use(express.static(__dirname + '/public')); // __dirname represents the directory where this script (app.js) is running

// Set EJS as the view engine (no need to add file extension of .ejs for partials)
app.set("view engine", "ejs");

// Enable urlencoded body parsing for POST html types
// Allows POST method types of forms to populate req.body
app.use(express.urlencoded({extended: true})); // Uses body-parser

// Handle get requests to the "/" page
app.get("/", (req, resp) => {
    resp.render("landing");
});

// Add mongoose ORM
var mongoose = require('mongoose');
// Connect to local mongodb instance and yelpcamp db
mongoose.connect("mongodb://localhost/yelpcamp");

// Add models
var Campground = require("./models/Campground");
var Comment = require("./models/Comment");

// Seed the data
var seed = require("./seed");
seed();

// Handle get requests to the "/campgrounds" page
app.get("/campgrounds", (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if(err) {
            res.send("An error occurred while retrieving campgrounds");
            console.log(err);
        } else {
            res.render("campgrounds/campgrounds", { campgrounds:campgrounds });
        }
    })
});

// Handle post requests to the "/campgrounds" page
app.post("/campgrounds", (req, res) => {
    if(req.body && req.body.name && req.body.image && req.body.description) {
        var newCG = {name: req.body.name, image: req.body.image, description: req.body.description};
        Campground.create(newCG, (err, campground) => {
            if(err) {
                console.log("Error saving to database");
                console.log(err);
            } else {
                res.redirect("/campgrounds");
            }
        })
    } else {
        console.log("Error while reading request body");
        console.log(req.body);
    }
});

// Show create campground page
app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new.ejs");
});

// SHOW route, show information about 1 specific campground
app.get("/campgrounds/:id", (req, res) => {
    // populate method is used to retrieve the linked model and get their data
    Campground.findById(req.params.id).populate("comments").exec((err, campground) => {
        if(err) {
            console.log("An error occurred while retrieving campground with id=" + req.params.id);
            console.log(err);
            res.send("Error");
        } else {
            res.render("campgrounds/show", {campground: campground});
        }
    })
})

// NEW route for comments
app.get("/campgrounds/:id/comments/new", (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    })
})

// CREATE route for comments
app.post("/campgrounds/:id/comments", (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(err) {
            console.log(err);
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if(err) {
                    console.log(err);
                    res.redirect("/campgrounds");
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
        }
    })
})

// Start the server and listen to port
app.listen(8080, () => {
    console.log("Server has started");
});