if(process.env.NODE_ENV !="production"){
  require('dotenv').config()
}

const express = require("express");
const mongoose = require("mongoose");
const app =  express(); 
const Listing = require('./models/listing.js');
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const Review = require("./models/reviews.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listings = require("./routes/listings.js");
const reviews = require("./routes/reviews.js");
const user = require("./routes/user.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
 .then(() =>{
  console.log("connected to DB");
}).catch((err) =>{
  console.log(err);
});

async function main(){
  await mongoose.connect(MONGO_URL);
}

app.set("view engine" , "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const sessionOptions = {
  secret: "mysupersecretcode", 
  resave: false,               
  saveUninitialized: true,     
  cookie: {
     expires: Date.now() + 7*24*60*60*1000,
     maxAge: 7*24*60*60*1000,
     httpOnly: true,
  }
};

app.use(session(sessionOptions)); 
app.use(flash());   // use flash before routes

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.get("/" , (req , res) =>{
  res.send("Hi, I am root");
});

// app.get("/demouser", async (req,res)=>{
//    let fakeUser = new User({
//     email: "student@gmail.com",
//     username: "delta-student",
//    });

//    let registeredUser = await User.register(fakeUser , "helloworld"); 
//    res.send(registeredUser);
// })

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", user);

app.use((err,req,res,next)=>{
  let {statusCode=500, message="something went wrong"} = err;
  res.status(statusCode).render("error.ejs",{message});
});

app.listen(8080,() => {
  console.log("server is lisiting to port 8080");
});