var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/Campground");
var Comment = require("../models/Comment");
var middleware = require("../middleware");

// NEW route for comments
router.get("/new", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(err) {
            console.log(err);
            req.flash("danger", "An error occurred while retrieving campground with id=" + req.params.id);
            res.redirect("back");
        } else {
            res.render("comments/new", {campground: campground});
        }
    })
})

// CREATE route for comments
router.post("/", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(err) {
            console.log(err);
            req.flash("danger", "An error occurred while retrieving campground with id=" + req.params.id);
            res.redirect("back");
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if(err) {
                    console.log(err);
                    req.flash("danger", "An error occurred while saving comment.");
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
router.get("/:cid/edit", middleware.isLoggedIn, middleware.isCommentAuthor, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(err) {
            console.log(err);
            req.flash("danger", "An error occurred while retrieving campground with id=" + req.params.id);
            res.redirect("back");
        } else {
            Comment.findById(req.params.cid, (err, comment) => {
                if(err) {
                    console.log(err);
                    req.flash("danger", "An error occurred while retrieving comment with id=" + req.params.cid);
                    res.redirect("back");
                } else {
                    res.render("comments/edit", {campground: campground, comment: comment});
                }
            })
        }
    })
})

// UPDATE route for comments
router.put("/:cid", middleware.isLoggedIn, middleware.isCommentAuthor, (req, res) => {
    Comment.findByIdAndUpdate(req.params.cid, req.body.comment, (err, comment) => {
        if(err) {
            console.log(err);
            req.flash("danger", "An error occurred while updating comment with id=" + req.params.cid);
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

// DESTROY route for comments
router.delete("/:cid", middleware.isLoggedIn, middleware.isCommentAuthor, (req, res) => {
    Comment.findByIdAndRemove(req.params.cid, (err) => {
        if(err) {
            console.log(err);
            req.flash("danger", "An error occurred while deleting comment with id=" + req.params.cid);
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

module.exports = router;