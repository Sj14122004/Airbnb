const express = require("express");
const app = express();
const mongoose = require('mongoose');
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./Schema.js");
const Review = require("./models/review.js");

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

const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        return next(new ExpressError(400, errMsg));
    }
        next();
    
}

const validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        return next(new ExpressError(400,errMsg));
    }
    next();
}
//index route
app.get("/listings", wrapAsync(async(req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings})
})
);

//new Route
app.get("/listings/new", (req,res) => {
    res.render("listings/new.ejs")
})
//Edit route
app.get("/listings/:id/edit", wrapAsync(async(req,res) => {
    let {id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing})
})
);
//update route
app.put("/listings/:id",validateListing, wrapAsync(async(req,res) => {
    let {id } = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`)
})
)

//delete route
app.delete("/listings/:id", wrapAsync(async(req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings")
})
);

    //revieww route
app.post("/listings/:id/reviews",
    validateReview,
    wrapAsync (async (req,res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`)
}));

//review delete
app.delete("/listings/:id/reviews/:reviewId",
    wrapAsync(async(req,res) => {
        let {id, reviewId} = req.params;

        await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
        await Review.findByIdAndDelete(reviewId);

        res.redirect(`/listings/${id}`);
    })
)
//show route
app.get("/listings/:id", wrapAsync(async(req,res) => {
    let {id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", {listing})
})
);

//create route
app.post("/listings",validateListing, wrapAsync(async(req,res) => {
    const newListing = new Listing( req.body.listing);
    await newListing.save();
    res.redirect("/listings");
})
);



// app.get("/testListing", async(req,res) => {
//     let sampleListing = new Listing ({
//         title: "My New Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute, GOa",
//         country: "India",
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing")
// })

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