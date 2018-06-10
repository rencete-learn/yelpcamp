var express = require("express");
var router = express.Router();
var Campground = require("../models/Campground");

// Handle get requests to the "/campgrounds" page
router.get("/campgrounds", (req, res) => {
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
router.post("/campgrounds", (req, res) => {
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
router.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new.ejs");
});

// SHOW route, show information about 1 specific campground
router.get("/campgrounds/:id", (req, res) => {
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

module.exports = router;