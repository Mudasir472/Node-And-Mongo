const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const path = require("path");
app.set("views", path.join(__dirname, 'views'))
app.set("view engine", "ejs");
const ejsMate = require('ejs-mate')
app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")))
const ExpressError = require("./ExpressError.js");
const cookieParser = require("cookie-parser");
app.use(cookieParser());

var flash = require('connect-flash');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./modals/user.js");
//routers
const listingRouter = require("./routes/listing.router.js");
const reviewRouter = require("./routes/review.router.js");
const userRouter = require('./routes/user.router.js');

var methodOverride = require('method-override')
app.use(methodOverride('_method'));


// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser()); //remembers the session when login
passport.deserializeUser(User.deserializeUser());//forget the session when log out

// Mongoose
const mongoose = require("mongoose");
const { name } = require("ejs");
const exp = require("constants");
const { wrap } = require("module");
const dbUrl = process.env.ATLAS_DB_URL;
main()
    .then(() => {
        console.log("mongo connects successfully");
    })
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/mudduWanderlust");
    // await mongoose.connect(dbUrl);
}

//session
const session = require("express-session");
const MongoStore = require('connect-mongo');

// const store = MongoStore.create({
//     mongoUrl: dbUrl,
//     crypto:{
//         secret: process.env.SESSION_SECRET
//     },
//     touchAfter: 24*3600
// });
    
app.use(session({
    // store: store,
    // store: MongoStore.create({ mongoUrl: dbUrl,ssl: true, }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}));

//middlewares for passport AUTHENTICATION
app.use(passport.initialize());
app.use(passport.session());


// Routes
app.get("/", (req, res) => {
    res.send("I am at root");
})

//flash MW
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    next();
})

//          <=========== ALL ROUTES ===========>

// listing Routes here
app.use("/listings", listingRouter);
//review routers here 
app.use("/listings/:id", reviewRouter);
//  user routes here
app.use("/", userRouter);

// page not found MW
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "page not found"))
});

//cookies
app.use(cookieParser());
//middle wares for error handling

app.use((err, req, res, next) => {
    let { statusCode = 500, msg = "default error occur" } = err;
    res.status(statusCode).render("error.ejs", { msg });
})

const port = 8080;
app.listen(port, () => {
    console.log("listening at port 8080");
});