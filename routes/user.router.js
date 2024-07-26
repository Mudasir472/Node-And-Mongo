const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../modals/user.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../Middleware.js");
//signup router
router.get("/signup", (req, res) => {
    res.render("user/signup.ejs");
});
router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser,(err)=>{
            if(err){
                next(err);
            }
            req.flash("success", "registered successfully")
            res.redirect("/listings");
        });
    }
    catch (e) {
        console.log(e.message)
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}));
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
