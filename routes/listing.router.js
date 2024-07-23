const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../Schema.js");
const Listing = require("../modals/listing.js");
const ExpressError = require("../ExpressError.js");
const cookieParser = require("cookie-parser");

router.use(cookieParser("secretCode"));

// index Route
router.get("/", wrapAsync(async (req, res) => {
    res.cookie("name", "Mudasir");
    res.cookie("visitHere", "yes", { signed: true });
    // console.log(req.cookies); //prints unsigned cookie
    // console.log(req.signedCookies);//prints signed cookies
    const initData = await Listing.find({});
    res.render("wanderlust/index.ejs", { initData })
}));

// Show Route
router.get("/:id/show", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let data = await Listing.findById(id).populate("review");
    res.render("wanderlust/show.ejs", { data });
}));

//Create Route
router.get("/new", (req, res) => {
    res.render("wanderlust/new.ejs");
})
router.post("/", wrapAsync(async (req, res, next) => {
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
    if(!newData){
        req.flash('error','Listing not found')
    }
    req.flash('success',"Listing Created Successfully");
    res.redirect("/listings");
}));

// Edit Route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let data = await Listing.findById(id);
    res.render("wanderlust/edit.ejs", { data });
}));

// Update Route

router.put("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let updatedData = await Listing.findByIdAndUpdate(id, { ...req.body })
    if(!updatedData){
        req.flash('error','Listing not found')
    }
    req.flash('success','Listing Updated Successsfully')
    res.redirect(`/listings/${id}/show`);

}));
//delete route
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedData = await Listing.findByIdAndDelete(id);
    if(!deletedData){
        req.flash('error','Listing not found')
    }
    req.flash('success','Listing Deleted Successsfully')
    res.redirect("/listings");
}));

module.exports = router;
