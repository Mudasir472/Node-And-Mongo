const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../Schema.js");
const Listing = require("../modals/listing.js");
const ExpressError = require("../ExpressError.js");
const cookieParser = require("cookie-parser");
const { isLoggedIn, isOwner } = require("../Middleware.js");
const path = require("path");
const listingController = require("../controllers/listings.js");

router.use(cookieParser("secretCode"));

router.route("/")
// index Route
.get(wrapAsync(listingController.index))
// create Post route
.post(isLoggedIn, wrapAsync(listingController.create))


router.route("/:id")
// Update Route
.put(isOwner, wrapAsync(listingController.update))
// delete route
.delete(isLoggedIn, isOwner, wrapAsync(listingController.delete));


// Show Route
router.get("/:id/show", wrapAsync(listingController.show));
//Create Route
router.get("/new", isLoggedIn, (req, res) => {
    res.render("wanderlust/new.ejs");
})
// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.edit));

module.exports = router;
