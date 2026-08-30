const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema} = require("../Schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");


router.get("/", wrapAsync(async(req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings})
})
);

const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        return next(new ExpressError(400, errMsg));
    }
        next();
    
}



//new Route
router.get("/new", (req,res) => {
    res.render("listings/new.ejs")
})
//Edit route
router.get("/:id/edit", wrapAsync(async(req,res) => {
    let {id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings")
    }
    res.render("listings/edit.ejs", {listing})
})
);
//update route
router.put("/:id",validateListing, wrapAsync(async(req,res) => {
    let {id } = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success", "Listings Updated")
    res.redirect(`/listings/${id}`)
})
)

//delete route
router.delete("/:id", wrapAsync(async(req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings")
})
);

    //revieww route

//show route
router.get("/:id", wrapAsync(async(req,res) => {
    let {id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings")
    }
    res.render("listings/show.ejs", {listing})
})
);

//create route
router.post("/",validateListing, wrapAsync(async(req,res) => {
    const newListing = new Listing( req.body.listing);
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
})
);


module.exports = router;