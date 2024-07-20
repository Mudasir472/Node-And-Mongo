const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema} = require("../Schema.js");
const Listing = require("../modals/listing.js");
const ExpressError = require("../ExpressError.js");


// index Route
router.get("/", wrapAsync( async (req, res) => {
    const initData = await Listing.find({});
    res.render("wanderlust/index.ejs", { initData })
}));

// Show Route

router.get("/:id/show", wrapAsync( async (req, res) => {
    let { id } = req.params;
    let data = await Listing.findById(id).populate("review");
    res.render("wanderlust/show.ejs", { data });
}));

//Create Route
router.get("/new", (req, res) => {
    res.render("wanderlust/new.ejs");
})
router.post("/", wrapAsync(async(req, res, next) => {
        const result = listingSchema.validate(req.body);
        let { title, description, price, location, country } = req.body;
        let newData = new Listing({
        title: title,
        description: description,
        price: price,
        location: location,
        country: country
    })
    // let newdata = new Listing(req.body.listings)
    await newData.save();
    res.redirect("/listings");
}));

// Edit Route
router.get("/:id/edit", wrapAsync( async (req, res) => {
    let { id } = req.params;
    let data = await Listing.findById(id);
    res.render("wanderlust/edit.ejs", { data });
}));

// Update Route

router.put("/:id", wrapAsync( async (req, res) => {
    let { id } = req.params;
    let updatedData = await Listing.findByIdAndUpdate(id, { ...req.body })
    res.redirect(`listings/${id}/show`);

}));

router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedData = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
    console.log("deleted successfully")
}));

module.exports = router;
