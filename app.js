const express = require("express");
const app = express();
const Listing = require("./models/listing.js");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
app.engine("ejs",ejsMate)
const methodOverride = require("method-override");

const path = require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.static(path.join(__dirname,"/public")));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
const port = 8080;

main().then(()=>{
    console.log("connection succesful");

}
).catch((err)=>{
    console.log(err);l
})

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust");
}

app.get("/",(req,res)=>{
    res.send("this is root");
})

// LISTING /INDEX ROUTE
app.get("/listings",async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
})

// new Rooute
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})
// CREATE 
app.post("/listings", async (req,res)=>{
    
    let newListing =  new Listing(req.body.listing);
    await newListing.save();
    
    res.redirect("/listings");

})

app.get("/listings/:id/edit",async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id)
    res.render("listings/edit.ejs",{listing});
})
// update
app.put("/listings/:id",async (req,res)=>{
    let {id} = req.params;
    let newListing = req.body.listing;
    await Listing.findByIdAndUpdate(id,{...newListing});
    res.redirect(`/listings/${id}`);

})

//DELETE
app.delete("/listings/:id",async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})

// READ 
app.get("/listings/:id",async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    
    res.render("listings/show",{listing});
})



// app.get("/Listing",async (req,res)=>{
//     const listing1 = new Listing({
//         title : "ganesh villa",
//         description : "not just villa this is the theme of peace",
//         price:1200,
//         location : "Pune Maharastra",
//         country: "india"
//     });
//     await listing1.save();
//     console.log("saved succesfulley ");
//     res.send("testing was successful ");

// })

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});