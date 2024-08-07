//
const Verification = require("../modals/verification.js");
const sentMail = require('../services/emailServices.js')
const User = require("../modals/user");
module.exports.signUp = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        let verifyData = new Verification({username,email,password});
        verifyData.save();
        // console.log(verifyData);
        if (email) {
            function generateSixDigitNumber() {
                return Math.floor(100000 + Math.random() * 900000);
            }
            const sixDigitNumber = generateSixDigitNumber();
            await sentMail(sixDigitNumber, email).then((msg) => {
                console.log("mail sent successfully")
            })
                .catch(err => {
                    console.log(err);
                })
            res.locals.mailCode = sixDigitNumber;
            
            res.render("user/emailVerify.ejs");
        }
        //     const newUser = new User({ username, email });
        //     const registeredUser = await User.register(newUser, password);
        //     req.login(registeredUser, (err) => {
        //         if (err) {
        //             next(err);
        //         }
        //         req.flash("success", "registered successfully")
        //         res.redirect("/listings");
        //     });
    }
    catch (e) {
        console.log(e.message)
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}