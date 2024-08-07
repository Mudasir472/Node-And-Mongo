
const User = require("../modals/user");
const express = require("express");
const router = express.Router();
const { render } = require("ejs");
const Verification = require("../modals/verification.js");

// emailController.email
router.post("/signup/verified", async (req, res) => {
    let mailCode = req.body.mailCode;
    if (res.locals.mailCode === mailCode) {
        try {
            let verifiedData = await Verification.find({});
            let { username , email , password} = verifiedData[0];
            const newUser = new User({ username, email });
            const registeredUser = await User.register(newUser, password);
            let deletedData = await Verification.deleteOne({})
            req.login(registeredUser, async(err) => {
                if (err) {
                    next(err);
                }
                req.flash("success", "registered successfully")
                res.redirect("/listings");
            });
        } catch (e) {
            console.log(e.message)
            req.flash("error", e.message);
            res.redirect("/signup");
        }
    }
    else {
        req.flash("error", "You entered a wrong Code, please try  again");
            res.redirect("/signup");
    }
});

module.exports = router;