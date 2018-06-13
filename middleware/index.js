var Campground = require("../models/Campground");
var Comment = require("../models/Comment");

var Middleware = function() {
    var createObjAuthorCheck = function(o /* mongoose object to query from */, 
                                           id /* name of id to use */) {
        return function(req, res, next) {        
            o.findById(req.params[id], (err, retObj) => {
                if(err) {
                    console.log(err);
                    req.flash("danger", "An error occurred while retrieving data from the database.")
                    res.redirect("back");
                } else {
                    if(retObj.author.id.equals(req.user.id)) {
                        next();
                    } else {
                        req.flash("warning", "You are not allowed to modify something that you are not the author of.")
                        res.redirect("back");
                    }
                }
            })
        }
    }
    
    this.isCampgroundAuthor = createObjAuthorCheck(Campground, "id");
    this.isCommentAuthor = createObjAuthorCheck(Comment, "cid");
}

Middleware.prototype.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("warning", "Please login first");
    res.redirect("/login");
}

module.exports = new Middleware();