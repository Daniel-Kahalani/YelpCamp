const Campground = require("./models/campground");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError");
const { campgroundSchemaValidator, reviewSchemaValidator } = require("./schemasValidators.js");

module.exports.isLoggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be signed in");
        return res.redirect("/login");
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {

    let { error } = campgroundSchemaValidator.validate(req.body);
    if (error) {
        let msg = error.details.map(err => err.massge).join(",");
        throw new ExpressError(msg, 400)
    }
    else {
        next();
    }
}


module.exports.validateReview = (req, res, next) => {

    let { error } = reviewSchemaValidator.validate(req.body);
    if (error) {
        let msg = error.details.map(err => err.massge).join(",");
        throw new ExpressError(msg, 400)
    }
    else {
        next();
    }
}

module.exports.isCampOwner = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.owner.equals(req.user._id)) {
        req.flash("error", "You dont have premissions");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewID } = req.params;
    const review = await Review.findById(reviewID);
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You dont have premissions");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}