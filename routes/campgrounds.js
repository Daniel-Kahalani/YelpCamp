const express = require("express");
const router = express.Router();
const { isLoggedin, validateCampground, isCampOwner } = require("../middleware");
const campgrounds = require("../controllers/campgrounds");
const multer = require('multer');
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router.route("/")
    .get(campgrounds.index)
    .post(isLoggedin, upload.array("image"), validateCampground, campgrounds.createCampground);

router.route("/new")
    .get(isLoggedin, campgrounds.renderNewForm);

router.route("/:id/edit")
    .get(isLoggedin, isCampOwner, campgrounds.renderEditForm);

router.route("/:id")
    .get(campgrounds.showCampground)
    .put(isLoggedin, isCampOwner, upload.array("image"), validateCampground, campgrounds.updateCampground)
    .delete(isLoggedin, isCampOwner, campgrounds.deleteCampground);

module.exports = router;