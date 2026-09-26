const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");



// LISTING /INDEX ROUTE
router.get("/", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
})

// new Rooute
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
})
// CREATE 
router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res, next) => {

    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();

    req.flash("success", "New listing created");

    res.redirect("/listings");


}));

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id)
    if (!listing) {
        req.flash("error", "Listing you searched Does not exist !");
        res.redirect("/listings");
        return;
    }
    res.render("listings/edit.ejs", { listing });
}));
// update
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let newListing = req.body.listing;

    await Listing.findByIdAndUpdate(id, { ...newListing });
    req.flash("success", " listing updated");
    res.redirect(`/listings/${id}`);

}));

//DELETE
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", " listing deleted");
    res.redirect("/listings");
}))

router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        })
        .populate("owner"); if (!listing) {
            req.flash("error", "Listing you searched Does not exist !");
            res.redirect("/listings");
            return;
        }
    res.render("listings/show.ejs", { listing });
}));




module.exports = router;