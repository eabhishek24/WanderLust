const express = require("express");
const Listing = require('../models/listing.js');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const {listingSchema} = require("../schema.js");
const {isLoggedIn , isOwner , validateListing} = require("../middleware.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage});

//contollers
const listingController = require("../controllers/listing.js");

router.route("/")
 .get(wrapAsync(listingController.index))  //Index route
 .post(isLoggedIn, upload.single('listing[image]') ,validateListing,wrapAsync(listingController.createListing)); //create route
 
//New route
router.get("/new",isLoggedIn, listingController.renderNewForm);

router.route("/:id")
 .get(wrapAsync(listingController.showListing))  // show route
 .put(isLoggedIn , isOwner, upload.single('listing[image]'),validateListing ,wrapAsync(listingController.updateListing)) // update route
 .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));  // delete route

// edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));

module.exports = router;