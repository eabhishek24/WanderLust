const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const Review = require("../models/reviews.js");
const Listing = require('../models/listing.js');
const {listingSchema,reviewSchema} = require("../schema.js");

const validateReview = (req,res,next) =>{
  let {error} = reviewSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError("404", errMsg);
  }else{
    next();
  }
};

//reviews
router.post("/", validateReview , wrapAsync(async (req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
  
    listing.reviews.push(newReview);
  
    await newReview.save();
    await listing.save();
   
    req.flash("success","Review Added");
    res.redirect(`/listings/${listing._id}`);
  }));
  
  router.delete("/:reviewId", wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
  
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);
  }));

module.exports = router;