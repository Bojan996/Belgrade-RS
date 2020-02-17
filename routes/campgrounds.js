var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var middleware = require("../middleware");
var random = require("../public/js/random");


////////// show all campgrounds ///////////
router.get("/", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index", {campgrounds:allCampgrounds});
        }
    });
});

////////// create campground route ///////////
router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name:name, price:price, image:image, description:description, author};
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        }else{
            req.flash("success", "Posted your campground " + req.user.username);
            res.redirect("/campgrounds");
        }
    });
});


////////// new route ///////////
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});


////////// show route ///////////
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            // res.render("campgrounds/show", {campground:foundCampground});
            Campground.find({}, function(err, allCampgrounds){
                res.render("campgrounds/show", {campgrounds: random(allCampgrounds), campground:foundCampground, });
            });
        }
    });
});



////////// edit campground  ///////////
router.get("/:id/edit", middleware.checkingIfAuthorized, function(req, res){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash("error", "Campground not found!");
                res.redirect("/campgrounds/" + req.params.id,);
            }else{
                res.render("../views/campgrounds/edit", {campground:foundCampground});
            }
        });
});

router.put("/:id", middleware.checkingIfAuthorized, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});



////////// delete the campground  ///////////
router.delete("/:id", middleware.checkingIfAuthorized, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            req.flash("success", "Campground Successfully deleted");
            res.redirect("/campgrounds");
        }
    });
});






module.exports = router;