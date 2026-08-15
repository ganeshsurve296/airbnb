const express = require("express");
const app = express();
const Listing = require("./models/listing.js");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate)
const methodOverride = require("method-override");
const wrapAsync = require("./utils/wrapAsync.js");
const expressErrors = require("./utils/expressErrors.js");
const { listingSchema } = require("./schema.js")
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "/public")));


const port = 8080;

main().then(() => {
    console.log("connection succesful");

}
).catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust");
}

app.get("/", (req, res) => {
    res.send("this is root");
})

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
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
})

// new Rooute
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
})
// CREATE 
app.post("/listings",validateListing, wrapAsync(async (req, res, next) => {

    let newListing = new Listing(req.body.listing);

    await newListing.save();

    res.redirect("/listings");


}));

app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id)
    if (!listing) {
        throw new expressErrors(404, "Listing not found!");
    }
    res.render("listings/edit.ejs", { listing });
}));
// update
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let newListing = req.body.listing;

    await Listing.findByIdAndUpdate(id, { ...newListing });
    res.redirect(`/listings/${id}`);

}));

//DELETE
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}))

// READ 
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        throw new expressErrors(404, "Listing not found!");
    }
    res.render("listings/show.ejs", { listing });
}));

app.all("/{*splat}", (req, res, next) => {
    next(new expressErrors(404, "Page not found !"));
})

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "somthing went wrong" } = err;
    if (err.name === "CastError") {
        statusCode = 404;
        message = "Listing not found!";
    }
    res.status(statusCode).render("listings/error.ejs", { message });
})

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});