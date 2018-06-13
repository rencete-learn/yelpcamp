var express = require("express");
var router = express.Router();
var Campground = require("../models/Campground");
var middleware = require("../middleware");

// Handle get requests to the "/campgrounds" page
router.get("/", (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if(err) {
            console.log(err);
            req.flash("danger", "An error occurred while retrieving campgrounds");
            res.redirect("back");
        } else {
            res.render("campgrounds/campgrounds", { campgrounds:campgrounds });
        }
    })
});

// Handle CREATE requests to the "/campgrounds" page
router.post("/", middleware.isLoggedIn, (req, res) => {
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
            console.log(err);
            req.flash("danger", "Error saving to database");
            res.redirect("back");
        } else {
            res.redirect("/campgrounds");
        }
    })
});

// Show NEW campground page
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

// SHOW route, show information about 1 specific campground
router.get("/:id", (req, res) => {
    // populate method is used to retrieve the linked model and get their data
    Campground.findById(req.params.id).populate("comments").exec((err, campground) => {
        if(err) {
            console.log(err);
            req.flash("danger", "An error occurred while retrieving campground with id=" + req.params.id);
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/show", {campground: campground});
        }
    })
})

// EDIT route to show edit page
router.get("/:id/edit", middleware.isLoggedIn, middleware.isCampgroundAuthor, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(err) {
            console.log(err);
            req.flash("danger", "An error occurred while retrieving campground with id=" + req.params.id);
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/edit", {campground: campground});
        }
    })
})

// UPDATE route to update the campground data
router.put("/:id", middleware.isLoggedIn, middleware.isCampgroundAuthor, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if(err) {
            console.log(err);
            req.flash("danger", "An error occurred while updating campground with id=" + req.params.id);
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + updatedCampground._id);
        }
    })
})

// DESTROY route to remove campground
router.delete("/:id", middleware.isLoggedIn, middleware.isCampgroundAuthor, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if(err) {
            console.log(err);
            req.flash("danger", "An error occurred while deleting campground with id=" + req.params.id);
            res.redirect("back");
        } else {
            res.redirect("/campgrounds");
        }
    })
})

module.exports = router;