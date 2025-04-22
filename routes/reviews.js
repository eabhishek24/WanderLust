const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const Review = require("../models/reviews.js");
const Listing = require('../models/listing.js');
const {listingSchema,reviewSchema} = require("../schema.js");
const {isLoggedIn , isReviewAuthor , validateReview} = require("../middleware.js");

// review controllers
const reviewControllers = require("../controllers/reviews.js");

//reviews
router.post("/", isLoggedIn ,validateReview , wrapAsync(reviewControllers.createReview));
  
router.delete("/:reviewId", isLoggedIn,isReviewAuthor ,wrapAsync(reviewControllers.deleteReview));

module.exports = router;