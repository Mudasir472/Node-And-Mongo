//
const User = require("../modals/user");
module.exports.signUp = async (req, res) => {
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
}