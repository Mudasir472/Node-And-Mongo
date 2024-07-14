const express = require("express");
const app = express();
const path = require("path");
app.set("views", path.join(__dirname, 'views'))
app.set("view engine", "ejs");
const ejsMate = require('ejs-mate')
app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")))
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./ExpressError.js");
const {listingSchema} = require("./Schema.js");

var methodOverride = require('method-override')
app.use(methodOverride('_method'))

// Mongoose
const Listing = require("./modals/listing.js");
const Review = require("./modals/Review.js");
const mongoose = require("mongoose");
const { name } = require("ejs");
const exp = require("constants");
const { wrap } = require("module");
main()
    .then(() => {
        console.log("mongo connects successfully");
    })
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/mudduWanderlust");
}

// Routes

app.get("/", (req, res) => {
    res.send("I am at root");
})

// index Route
app.get("/listings", wrapAsync( async (req, res) => {
    const initData = await Listing.find({});
    res.render("wanderlust/index.ejs", { initData })
}));

// Show Route

app.get("/listings/:id/show", wrapAsync( async (req, res) => {
    let { id } = req.params;
    let data = await Listing.findById(id).populate("review");
    res.render("wanderlust/show.ejs", { data });
}));

//Create Route
app.get("/listings/new", (req, res) => {
    res.render("wanderlust/new.ejs");
})
app.post("/listings", wrapAsync(async(req, res, next) => {
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
app.get("/listings/:id/edit", wrapAsync( async (req, res) => {
    let { id } = req.params;
    let data = await Listing.findById(id);
    res.render("wanderlust/edit.ejs", { data });
}));

// Update Route

app.put("/listings/:id", wrapAsync( async (req, res) => {
    let { id } = req.params;
    let updatedData = await Listing.findByIdAndUpdate(id, { ...req.body })
    res.redirect(`/listings/${id}/show`);

}));

app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedData = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
    console.log("deleted successfully")
}));

app.post("/listings/:id/review",async (req,res)=>{
    // let deletedData = await Review.deleteMany({}).then(()=>{console.log("Data delets")})
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);  //all data from user saves in db through  it
    listing.review.push(newReview);
    await listing.save();
    await newReview.save();
    console.log("new review recorded");
    res.redirect(`/listings/${id}/show`);
})
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"))
})
//middle wares for error handling

app.use((err, req, res, next) => {
    let {statusCode=500,msg="default error occur"} = err;
    res.status(statusCode).render("error.ejs",{msg});

})

const port = 8080;
app.listen(port, () => {
    console.log("listening at port 8080");
})