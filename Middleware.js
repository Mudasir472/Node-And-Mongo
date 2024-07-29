const Listing = require("./modals/listing.js");
const Review = require("./modals/Review.js");

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be loggin first");
        return res.redirect("/login");
    }
    next();
}
module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req,res,next)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!res.locals.currUser._id.equals(listing.owner._id)){
        req.flash("error","you don't have permission");
        return res.redirect(`/listings/${id}/show`);
    }
    next();
}
module.exports.isAuther = async (req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!res.locals.currUser._id.equals(review.auther._id)){
        req.flash("error","you are not owner of review");
        return res.redirect(`/listings/${id}/show`);
    }
    next();
}