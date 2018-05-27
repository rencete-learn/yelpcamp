// Use express web application framework
var express = require("express");
var app = express();

// Identify public folders
app.use(express.static('public'));
// Set EJS as the view engine
app.set("view engine", "ejs");

// Enable urlencoded body parsing for POST html types
app.use(express.urlencoded({extended: true}));

// Handle get requests to the "/" page
app.get("/", (req, resp) => {
    resp.render("landing");
});

// Add mongoose ORM
var mongoose = require('mongoose');
// Connect to local mongodb instance and yelpcamp db
mongoose.connect("mongodb://localhost/yelpcamp");
// Define Campground schema
var CampgroundSchema = mongoose.Schema({
    name: String,
    image: String,
    description: String
});
// Create Campground model
var Campground = mongoose.model("Campground", CampgroundSchema);

// Handle get requests to the "/campgrounds" page
app.get("/campgrounds", (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if(err) {
            res.send("An error occurred while retrieving campgrounds");
            console.log(err);
        } else {
            res.render("campgrounds", { campgrounds:campgrounds });
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
    res.render("new.ejs");
});

// SHOW route, show information about 1 specific campground
app.get("/campgrounds/:id", (req, res) => {
    console.log(req.params.id);
    Campground.findById(req.params.id, (err, campground) => {
        if(err) {
            console.log("An error occurred while retrieving campground with id=" + req.params.id);
            console.log(err);
            res.send("Error");
        } else {
            console.log(campground);
            res.render("show", campground);
        }
    })
})

// Start the server and listen to port
app.listen(8080, () => {
    console.log("Server has started");
});