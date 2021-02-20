const express = require("express");
const router = express.Router({ mergeParams: true });
const { isLoggedin, validateReview, isReviewAuthor } = require("../middleware");
const reviews = require("../controllers/reviews");

router.route("/")
    .post(isLoggedin, validateReview, reviews.addReview);

router.route("/:reviewID")
    .delete(isLoggedin, isReviewAuthor, reviews.deleteReview);

module.exports = router;