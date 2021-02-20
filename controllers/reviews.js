const Campground = require("../models/campground");
const Review = require("../models/review");
const wrapAsync = require("../utils/warpAsync");


module.exports.addReview = wrapAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    campground.reviews.push(newReview);
    await newReview.save();
    await campground.save();
    req.flash("success", "Successfully added a new review");
    res.redirect(`/campgrounds/${campground._id}`);
});

module.exports.deleteReview = wrapAsync(async (req, res) => {
    const { id, reviewID } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewID } }, { useFindAndModify: false });
    await Review.findByIdAndDelete(reviewID);
    req.flash("success", "Successfully deleted review");
    res.redirect(`/campgrounds/${id}`);
});