require('dotenv').config();
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
const {storage} = require("../cloudConfig.js");
const multer  = require('multer')
const upload = multer({ storage })

router.use(cookieParser("secretCode"));

// router.route("/")
// index Route
router.get("/",wrapAsync(listingController.index))

router.post("/",upload.single("listing[image]"),wrapAsync(listingController.create));

router.route("/:id")          
// Update Route
.put(isOwner, upload.single("listing[image]"), wrapAsync(listingController.update))
// delete route
router.delete("/:id",isLoggedIn, isOwner, wrapAsync(listingController.delete));


// Show Route
router.get("/:id/show", wrapAsync(listingController.show));
//Create Route
router.get("/new", isLoggedIn, (req, res) => {
    res.render("wanderlust/new.ejs");
})
// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.edit));

module.exports = router;
