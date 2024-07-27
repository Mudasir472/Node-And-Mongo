const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../modals/user.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../Middleware.js");
const userController = require("../controllers/users.js");

//signup router
router.get("/signup", (req, res) => {
    res.render("user/signup.ejs");
});
router.post("/signup", wrapAsync(userController.signUp));
//login router
router.get("/login", (req, res) => {
    res.render("user/login.ejs");
});
router.post('/login',saveRedirectUrl, passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), async (req, res) => {
    req.flash("success", "Welcome Back to Wanderlust");
    let redUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redUrl);
})

//logout router
router.get("/logout",(req,res)=>{
    req.logOut((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","you logged out");
        res.redirect("/listings");
    })
})
module.exports = router;
