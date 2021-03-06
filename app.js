// Use express web application framework
var express = require("express");
var app = express();
// Add mongoose ORM
var mongoose = require('mongoose');
// Middleware setup
var methodOverride = require("method-override");
var passport = require("passport");
var localStrategy = require("passport-local");
var middleware = require("./middleware"); // custom middleware
// Add models
var User = require("./models/User");
// Add routes
var indexRoutes = require("./routes/index");
var campgroundRoutes = require("./routes/campgrounds");
var commentRoutes = require("./routes/comments");
// Flash messages
var flash = require("connect-flash");

// Seed the data
// var seed = require("./seed");
// seed();

// Connect to local mongodb instance and yelpcamp db
mongoose.connect("mongodb://localhost/yelpcamp");

// Override using query string to be able to use PUT verbs
app.use(methodOverride("_method"));

// Identify public folders for common assets like scripts and css
app.use(express.static(__dirname + '/public')); // __dirname represents the directory where this script (app.js) is running

// Set EJS as the view engine (no need to add file extension of .ejs for partials)
app.set("view engine", "ejs");

// Enable urlencoded body parsing for POST html types
// Allows POST method types of forms to populate req.body
app.use(express.urlencoded({extended: true})); // Uses body-parser

// Session and Passport middleware setup
app.use(require("express-session")({
    secret: "This camp is like Scooby Doo!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
// Passport setup
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware for flash messages
app.use(flash());

// Middleware to set the response local variables
app.use(middleware.setResponseLocals);

// Use the routes
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// Start the server and listen to port
app.listen(8080, () => {
    console.log("Server has started");
});