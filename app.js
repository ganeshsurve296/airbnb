const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate)
const methodOverride = require("method-override");
const expressErrors = require("./utils/expressErrors.js");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "/public")));

const listings = require("./routes/listing.js");
const reviews = require("./routes/reviews.js");

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

app.use("/listings",listings)

app.use("/listings/:id/review",reviews);


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