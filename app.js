const express = require("express");
const app = express();
const path = require("path");
app.set("views", path.join(__dirname, 'views'))
app.set("view engine", "ejs");
const ejsMate = require('ejs-mate')
app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")))

var methodOverride = require('method-override')
app.use(methodOverride('_method'))

// Mongoose
const Listing = require("./modals/listing.js");
const mongoose = require("mongoose");
const { name } = require("ejs");
const exp = require("constants");
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
app.get("/listings", async (req, res) => {
    const initData = await Listing.find({});
    res.render("wanderlust/index.ejs", { initData })
})

// Show Route

app.get("/listings/:id/show", async (req, res) => {
    let { id } = req.params;
    let data = await Listing.findById(id);
    res.render("wanderlust/show.ejs", { data });
})

//Create Route
app.get("/listings/new", (req, res) => {
    res.render("wanderlust/new.ejs");
})
app.post("/listings", async (req, res) => {
    let { title, description, price, location, country } = req.body;
    let newData = new Listing({
        title: title,
        description: description,
        price: price,
        location: location,
        country: country
    })
    await newData.save();
    console.log(newData)
   


    res.redirect("/listings");
})

// Edit Route
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    let data = await Listing.findById(id);
    res.render("wanderlust/edit.ejs", { data });
})

// Update Route

app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let updatedData = await Listing.findByIdAndUpdate(id, { ...req.body })
    res.redirect(`/listings/${id}/show`);

});

app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let deletedData = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
    console.log("deleted successfully")
})

const port = 8080;
app.listen(port, () => {
    console.log("listening at port 8080");
})