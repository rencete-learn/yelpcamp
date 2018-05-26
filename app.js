// Temporary campgrounds list (before being added to database)
var campgrounds = [
    { name: "Salmon Creek", image: "https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"},
    { name: "Granite Hill", image: "https://images.pexels.com/photos/939723/pexels-photo-939723.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"},
    { name: "Mountain Goat's Rest", image: "https://images.pexels.com/photos/14287/pexels-photo-14287.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"},
    { name: "Salmon Creek", image: "https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"},
    { name: "Granite Hill", image: "https://images.pexels.com/photos/939723/pexels-photo-939723.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"},
    { name: "Mountain Goat's Rest", image: "https://images.pexels.com/photos/14287/pexels-photo-14287.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"},
    { name: "Salmon Creek", image: "https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"},
    { name: "Granite Hill", image: "https://images.pexels.com/photos/939723/pexels-photo-939723.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"},
    { name: "Mountain Goat's Rest", image: "https://images.pexels.com/photos/14287/pexels-photo-14287.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"}
]

// Use express web application framework
var express = require("express");
var app = express();

// Identify public folders
app.use(express.static('public'));
// Set EJS as the view engine
app.set("view engine", "ejs");

// Enable urlencoded body parsing
app.use(express.urlencoded({extended: true}));

// Handle get requests to the "/" page
app.get("/", (req, resp) => {
    resp.render("landing");
});

// Handle get requests to the "/campgrounds" page
app.get("/campgrounds", (req, res) => {
    res.render("campgrounds", {campgrounds:campgrounds});
});

// Handle post requests to the "/campgrounds" page
app.post("/campgrounds", (req, res) => {
    if(req.body && req.body.name && req.body.image) {
        var newCG = {name: req.body.name, image: req.body.image};
        campgrounds.push(newCG);
        res.redirect("/campgrounds");
    }
});

app.get("/campgrounds/new", (req, res) => {
    res.render("new.ejs");
});

// Start the server and listen to port
app.listen(8080, () => {
    console.log("Server has started");
});