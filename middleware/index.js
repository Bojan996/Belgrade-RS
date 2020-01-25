var Campground = require("../models/campground");
var Comment = require("../models/comment");


//////////////// ALL OF THE MIDDLEWARE GOES HERE /////////////
var middlewareObj = {};

//////////////// CHECKING IF AUTHORIZED FOR EDIT AND DELETE CAMPGROUNDS /////////////
middlewareObj.checkingIfAuthorized = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash("error", "Campground not found!");
                res.redirect("back");
            }else{
                if(foundCampground.author.id.equals(req.user.id)){
                    next();
                }else{
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
}

//////////////// CHECKING IF AUTHORIZED FOR EDIT AND DELETE COMMENTS /////////////
middlewareObj.checkingIfAuthorizedForComments = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            }else{
                if(foundComment.author.id.equals(req.user.id)){
                    next();
                }else{
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error", "You need to bee logged in to do that!");
        res.redirect("back");
    }
}

////////CHECKING IF THE USER IS LOGED IN middleware!
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be Logged in to do that!");
    res.redirect("/login");
}




module.exports = middlewareObj;