const wrapAsync = require("../utils/warpAsync");
const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = wrapAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
});

module.exports.renderNewForm = (req, res) => {
    res.render("campgrounds/new");
};

module.exports.createCampground = wrapAsync(async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    let newCamp = new Campground(req.body.campground);
    newCamp.geometry = geoData.body.features[0].geometry;
    newCamp.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    newCamp.owner = req.user._id;
    await newCamp.save();
    req.flash("success", "Successfully added a new campground");
    res.redirect(`/campgrounds/${newCamp._id}`);
});

module.exports.renderEditForm = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash("error", "campground didnt exist");
        res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
})

module.exports.showCampground = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!campground) {
        req.flash("error", "campground didnt exist");
        res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
})

module.exports.updateCampground = wrapAsync(async (req, res) => {
    const { id } = req.params;
    let campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { runValidators: true })
    let imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash("success", "Successfully updated campground");
    res.redirect(`/campgrounds/${id}`);
})

module.exports.deleteCampground = wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted campground");
    res.redirect("/campgrounds");
})