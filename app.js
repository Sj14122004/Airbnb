const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


main()
.then((res) => console.log("connected to db"))
.catch(err => console.log(err));



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

}


const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
    }
};

app.use(session(sessionOptions));//that create the session to remember the temporary data
app.use(flash()); // middleware that shows the temporary message
app.use(passport.initialize());//middle ware that initialize the passport
app.use(passport.session());// a web application needs the ability to identify users as they browse from page to page. this series of requests and response ,each associated with the same user is know as a session
passport.use(new LocalStrategy(User.authenticate()));//when a user tries to login with username/passowrd, use user.authenticate to check them
passport.serializeUser(User.serializeUser());//something small to store in the session
passport.deserializeUser(User.deserializeUser());//use that id to get the user back from the database


app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})
//index route

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


app.get("/", (req,res) => {
    res.send("hello")
    console.log("hi i am shivam")
})



// for the page that does not exist

app.all("/{*splat}", (req,res,next) => {
    next(new ExpressError(404, "Page not Found"))
});


//middle ware error handler
app.use((err,req,res,next) => {
    let {statusCode=500, message="Something went wrong"} = err;
    res.status(statusCode).render("error.ejs", {err})
    // res.status(statusCode).send(message);
});


app.listen(3000, () => {
    console.log("server is running")
});