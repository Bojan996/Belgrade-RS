var express = require("express"),
    port = process.env.PORT || 8080,
    app         = express(),
    mongoose    = require("mongoose"),
    bodyParser  = require("body-parser"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    passport = require("passport"),
    LocalStratigy = require("passport-local"),
    User = require("./models/users"),
    seedDB = require("./seeds"),
    methodOverride = require("method-override"),
    flash = require("connect-flash");


////////// REQUERING ROUTES ///////////
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");



////////// DATABASE SETUP ///////////
mongoose.connect('mongodb+srv://boki:0638893835m@cluster0-bbwod.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
    }).then(() => {
        console.log('Connected to DB!');
    }).catch(err => {
        console.log('ERROR:', err.message);
    });
////////// END OF DATABASE SETUP ///////////



////////// USING NORMAL STUFF ///////////
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();



////////// PASSPORT CONFIGURATION ///////////
app.use(require("express-session")({
    secret: "pampur je debeo",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratigy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
////////// END ///////////



////////// PASSING SOMETHING TO EVERY ROUTE ///////////
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});



////////// REQUIREING ROUTES ///////////
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use(indexRoutes);




app.listen(port, function(){
    console.log("it's working");
});