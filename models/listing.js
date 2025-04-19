const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews.js");
const User = require("./user.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true, // Fixed typo
    },
    description: String,

    image: {
        type: String,
        set: (v) =>
            v === ""
            ? "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
            : v.toString(),
    },

    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Reviews",
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

listingSchema.post("findOneAndDelete", async(listing)=>{
   if(listing){ 
    await Review.deleteMany({_id : {$in: listing.reviews}});
   }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;