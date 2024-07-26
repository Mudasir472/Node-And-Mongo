const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../modals/listing.js");
const Review = require("../modals/Review.js");
const { isLoggedIn, isAuther } = require("../Middleware.js");

// post review route
router.post("/review", wrapAsync( async (req,res)=>{
    // let deletedData = await Review.deleteMany({}).then(()=>{console.log("Data delets")})
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);  //all data from user saves in db through  it
    newReview.auther = req.user._id;    //when review created , it saves the info of auther of review
    listing.review.push(newReview);
    await listing.save();
    await newReview.save();
    if(!newReview){
        req.flash('error','Review not found')
    }
    req.flash('success','Review Created Successsfully')
    res.redirect(`/listings/${id}/show`);
}));

// delete review route

router.delete("/delete/:reviewId",isLoggedIn,isAuther, wrapAsync(async (req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {review: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    if(!Review){
        req.flash('error','Review not found')
    }
    req.flash('success','Review Deleted Successsfully')
    res.redirect(`/listings/${id}/show`);
}));

module.exports = router;