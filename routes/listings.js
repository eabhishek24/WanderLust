const express = require("express");
const Listing = require('../models/listing.js');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const {listingSchema} = require("../schema.js");
const {isLoggedIn} = require("../middleware.js");

const validateListing = (req,res,next) =>{
  let {error} = listingSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(404, errMsg);
  }else{
    next();
  }
};

//Index route
router.get("/", wrapAsync(async (req,res) =>{
  const allListings = await Listing.find({});
  res.render("listings/index.ejs" , {allListings});
}));

//New route
router.get("/new",isLoggedIn,(req,res)=>{
  res.render("listings/new.ejs");
});

//show Route
router.get("/:id", wrapAsync(async (req , res) =>{
  let {id} = req.params;
  const listing = await Listing.findById(id).populate("reviews").populate("reviews").populate("owner");
  if(!listing){
    req.flash("error","Listing you requested for does not exist");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", {listing});
}));

// create route
router.post("/",isLoggedIn,validateListing ,wrapAsync(async (req,res)=>{
  let newListing = new Listing(req.body.listing);
  newListing.owner = req.user;
  await newListing.save();
  req.flash("success","New Listing Created");
  res.redirect("/listings");
}));

// edit route
router.get("/:id/edit", isLoggedIn,wrapAsync(async (req,res)=>{
  let {id} = req.params;
  const listing = await Listing.findById(id);
  if(!listing){
    req.flash("error","Listing you requested for does not exist");
    res.redirect("/listings");
  }
  res.render("listings/edit.ejs",{listing})
}));

//Update route
router.put("/:id",isLoggedIn ,validateListing ,wrapAsync(async(req , res)=>{
  let {id} = req.params;
  await Listing.findByIdAndUpdate(id, {...req.body.listing});
  req.flash("success"," Listing Updated");
  res.redirect(`/listings/${id}`);
}));

//Delete route
router.delete("/:id",isLoggedIn,wrapAsync(async (req,res)=>{
  let {id} = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success"," Listing Deleted");
  res.redirect("/listings");
}));

// app.all("*", (req,res,next)=>{
//   next(new ExpressError(404, "Page Not Found!"));
// });

// app.use((err,req,res,next) =>{    // middleware
//   let {statuscode=500,message="Something went wrong"} = err;
//   //res.status(statuscode).send(message);
//   res.render("error.ejs", {message});
// });


module.exports = router;