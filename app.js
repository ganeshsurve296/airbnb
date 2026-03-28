const express = require("express");
const app = express();
const Listing = require("./models/listing.js");
const mongoose = require("mongoose");
const path = require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.urlencoded({ extended: true }));
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
app.get("/listing",async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
})

// READ 
app.get("/listings/:id",async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    console.log(listing);
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