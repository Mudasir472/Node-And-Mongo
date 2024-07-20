const express = require("express");
const app = express();
const path = require("path");
app.set("views", path.join(__dirname, 'views'))
app.set("view engine", "ejs");
const ejsMate = require('ejs-mate')
app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")))
const ExpressError = require("./ExpressError.js");

//routers
const listingRouter = require("./routes/listing.router.js");
const reviewRouter = require("./routes/review.router.js");

var methodOverride = require('method-override')
app.use(methodOverride('_method'));

// Mongoose
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

// listing Routes here
app.use("/listings",listingRouter);
//review routers here 
app.use("/listings/:id",reviewRouter);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"))
});



//middle wares for error handling

app.use((err, req, res, next) => {
    let {statusCode=500,msg="default error occur"} = err;
    res.status(statusCode).render("error.ejs",{msg});

})

const port = 8080;
app.listen(port, () => {
    console.log("listening at port 8080");
})