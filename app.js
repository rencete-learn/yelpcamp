var express = require("express");
var app = express();

app.set("view engine", "ejs");

app.get("/", (req, resp) => {
    resp.render("landing");
});

app.get("/campgrounds", (req, res) => {
    var campgrounds = [
        { name: "Salmon Creek", image: "https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"},
        { name: "Granite Hill", image: "https://images.pexels.com/photos/939723/pexels-photo-939723.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"},
        { name: "Mountain Goat's Rest", image: "https://images.pexels.com/photos/14287/pexels-photo-14287.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"}
    ]

    res.render("campgrounds", {campgrounds:campgrounds});
});

app.listen(8080, () => {
    console.log("Server has started");
});