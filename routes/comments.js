var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/Campground");
var Comment = require("../models/Comment");

// NEW route for comments
router.get("/new", isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    })
})

// CREATE route for comments
router.post("/", isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(err) {
            console.log(err);
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if(err) {
                    console.log(err);
                    res.redirect("/campgrounds");
                } else {
                    // Add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    // Save the comment
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
        }
    })
})

// EDIT route for comments
router.get("/:cid/edit", isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(err) {
            console.log(err);
            res.redirect("back");
        } else {
            Comment.findById(req.params.cid, (err, comment) => {
                if(err) {
                    console.log(err);
                    res.redirect("back");
                } else {
                    res.render("comments/edit", {campground: campground, comment: comment});
                }
            })
        }
    })
})

// UPDATE route for comments
router.put("/:cid", (req, res) => {
    Comment.findByIdAndUpdate(req.params.cid, req.body.comment, (err, comment) => {
        if(err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

// DESTROY route for comments
router.delete("/:cid", (req, res) => {
    Comment.findByIdAndRemove(req.params.cid, (err) => {
        if(err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
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