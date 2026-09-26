const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate)
const methodOverride = require("method-override");
const expressErrors = require("./utils/expressErrors.js");

const session = require("express-session");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "/public")));

const listingsRoute = require("./routes/listing.js");
const reviewsRoute = require("./routes/reviews.js");
const userRoute = require("./routes/user.js");

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


const sessionOptions = {
    secret : "mysupersecreatstring" , 
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
    
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success  = req.flash("success");
    res.locals.error  = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.get("/demouser",async (req,res)=>{
    let fakeUser = new User({
        email : "ganesh@gmail.com",
        username : "grs13",
    });

    let registeredUser = await User.register(fakeUser,"hello world");
    res.send(registeredUser);
})

app.use("/listings",listingsRoute)

app.use("/listings/:id/reviews",reviewsRoute);

app.use("/",userRoute);


app.get("/", (req, res) => {
    res.send("this is root");
})


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