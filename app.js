const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");



const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
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

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
app.get("/", (req,res) => {
    res.send("hello")
    console.log("hi i am shivam")
})


//index route

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

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