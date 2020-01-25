var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");


////////// comments create  ///////////
router.get("/new", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground:foundCampground});
        }
    });
});



////////// comments create ///////////
router.post("/", middleware.isLoggedIn, function(req, res){

    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            res.redirect("/campgrounds");
        }else{
            Comment.create(req.body.comment, function(err, newComment){
                if(err){
                    req.flash("error", "Sorry! Something went wrong..");
                    console.log(err);
                }else{
                    newComment.author.id = req.user._id;
                    newComment.author.username = req.user.username;
                    newComment.save();
                    foundCampground.comments.push(newComment);
                    foundCampground.save();
                    req.flash("success", "Successfully added comment!");
                    res.redirect("/campgrounds/" + req.params.id);
                }
            });
        }
    });

});



////////// Edit comments route ///////////
router.get("/:comment_id/edit", middleware.checkingIfAuthorizedForComments, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect(back);
        }else{
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
});

router.put("/:comment_id", middleware.checkingIfAuthorizedForComments, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment,  function(err, foundComment){
        if(err){
            res.redirect(back);
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});



////////// Delete the comment ///////////
router.delete("/:comment_id", middleware.checkingIfAuthorizedForComments,  function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        }else{
            req.flash("success", "Comment Deleted!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});








module.exports = router;