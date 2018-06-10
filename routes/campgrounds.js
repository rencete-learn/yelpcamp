var express = require("express");
var router = express.Router();
var Campground = require("../models/Campground");

// Handle get requests to the "/campgrounds" page
router.get("/", (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if(err) {
            res.send("An error occurred while retrieving campgrounds");
            console.log(err);
        } else {
            res.render("campgrounds/campgrounds", { campgrounds:campgrounds });
        }
    })
});

// Handle CREATE requests to the "/campgrounds" page
router.post("/", isLoggedIn, (req, res) => {
    if(req.body && req.body.name && req.body.image && req.body.description) {
        var newCG = {
            name: req.body.name,
            image: req.body.image,
            description: req.body.description,
            author: {
                id: req.user.id,
                username: req.user.username
            }
        };
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

// Show NEW campground page
router.get("/new", isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

// SHOW route, show information about 1 specific campground
router.get("/:id", (req, res) => {
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

// EDIT route to show edit page
router.get("/:id/edit", (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/edit", {campground: campground});
        }
    })
})

// UPDATE route to update the campground data
router.put("/:id", (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds/" + updatedCampground._id);
        }
    })
})

// Middleware
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;