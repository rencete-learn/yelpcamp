var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/User");

// Handle get requests to the "/" page
router.get("/", (req, resp) => {
    resp.render("landing");
});

// AUTH Routes
router.get("/register", (req, res) => {
    res.render("register");
})

router.post("/register", (req, res) => {
    User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
        if(err) {
            console.log(err);
            req.flash("warning", err.message);
            res.redirect("back");
        } else {
            passport.authenticate("local")(req, res, () => {
                res.redirect("/campgrounds");
            })
        }
    });
})

// Login routes
router.get("/login", (req, res) => {
    res.render("login");
})

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), (req, res) => {
    
})

// Logout route
router.get("/logout", (req, res) => {
    req.flash("success", "Successfully logged out " + res.locals.user.username);
    req.logout();
    res.redirect("/campgrounds");
})

module.exports = router;