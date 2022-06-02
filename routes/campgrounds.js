const express = require("express");
const router = express.Router();
const { campgroundSchema } = require("../Schemas");
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campgrounds");

const validateCampground = (req, res, next) => {
	const { error } = campgroundSchema.validate(req.body);
	if (error) {
		const errMsg = error.details.map((el) => el.message).join(",");
		throw new ExpressError(errMsg, 400);
	} else {
		next();
	}
};

router.get(
	"/",
	catchAsync(async (req, res) => {
		const campgrounds = await Campground.find({});
		res.render("campgrounds/index", { campgrounds });
	})
);

router.get(
	"/new",
	catchAsync(async (req, res) => {
		res.render("campgrounds/new");
	})
);

router.post(
	"/",
	validateCampground,
	catchAsync(async (req, res, next) => {
		// if (!req.body.campground)
		// 	throw new ExpressError("Invalid Campground Data", 400);

		const campground = new Campground(req.body.campground);
		await campground.save();
		req.flash("success", "Campground created successfully");
		res.redirect(`/campgrounds/${campground._id}`);
	})
);

router.get(
	"/:id",
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const campground = await Campground.findById(id).populate("reviews");
		if (!campground) {
			req.flash("error", "Cannot find that campground ");
			return res.redirect("/campgrounds");
		}
		res.render("campgrounds/details", { campground });
	})
);
router.get(
	"/:id/edit",
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const campground = await Campground.findById(id);
		if (!campground) {
			req.flash("error", "Cannot find that campground ");
			return res.redirect("/campgrounds");
		}
		res.render("campgrounds/edit", { campground });
	})
);
router.put(
	"/:id",
	validateCampground,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const campground = await Campground.findByIdAndUpdate(id, {
			...req.body.campground,
		});
		req.flash("success", "Updated Campground ");
		res.redirect(`/campgrounds/${campground._id}`);
	})
);

router.delete(
	"/:id",
	catchAsync(async (req, res) => {
		const { id } = req.params;
		await Campground.findByIdAndDelete(id);
		req.flash("success", "Campground Deleted");
		res.redirect(`/campgrounds`);
	})
);

module.exports = router;
