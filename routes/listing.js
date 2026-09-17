const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema,reviewSchema } = require("../schema.js")
const expressErrors = require("../utils/expressErrors.js");
const Listing = require("../models/listing.js");

const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    
    if (error) {
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new expressErrors(400,errMsg);
    }else{
        next();
    }
}

// LISTING /INDEX ROUTE
router.get("/", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
})

// new Rooute
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
})
// CREATE 
router.post("/",validateListing, wrapAsync(async (req, res, next) => {

    let newListing = new Listing(req.body.listing);

    await newListing.save();

    res.redirect("/");


}));

router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id)
    if (!listing) {
        throw new expressErrors(404, "Listing not found!");
    }
    res.render("/edit.ejs", { listing });
}));
// update
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let newListing = req.body.listing;

    await Listing.findByIdAndUpdate(id, { ...newListing });
    res.redirect(`/listings/${id}`);

}));

//DELETE
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}))

router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
        throw new expressErrors(404, "Listing not found!");
    }
    res.render("listings/show.ejs", { listing });
}));




module.exports = router;