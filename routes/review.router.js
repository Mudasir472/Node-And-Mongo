const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isAuther } = require("../Middleware.js");
const reviewController = require("../controllers/reviews.js");

// post review route
router.post("/review", wrapAsync(reviewController.postReview));

// delete review route

router.delete("/delete/:reviewId",isLoggedIn,isAuther, wrapAsync(reviewController.deleteReview));

module.exports = router;