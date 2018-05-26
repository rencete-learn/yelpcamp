var express = require("express");
var app = express();

app.set("view engine", "ejs");

app.get("/", (req, resp) => {
    resp.render("landing");
})

app.listen(8080, () => {
    console.log("Server has started");
})