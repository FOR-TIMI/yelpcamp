const express = require("express");
const router = express.Router({ mergeParams: true });

const { reviewSchema } = require("../Schemas.js");

const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");

const Campground = require("../models/campgrounds");
const Review = require("../models/reviews");

const validateReview = (req, res, next) => {
	const { error } = reviewSchema.validate(req.body);
	if (error) {
		const errMsg = error.details.map((el) => el.message).join(",");
		throw new ExpressError(errMsg, 400);
	} else {
		next();
	}
};

//routes

router.post(
	"/",
	validateReview,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const campground = await Campground.findById(id);
		const review = new Review(req.body.review);
		campground.reviews.push(review);
		await review.save();
		await campground.save();
		req.flash("success", "Review added successfully");
		res.redirect(`/campgrounds/${campground._id}`);
	})
);

router.delete(
	"/:reviewId",
	catchAsync(async (req, res) => {
		const { id, reviewId } = req.params;
		await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
		await Review.findByIdAndDelete(reviewId);
		req.flash("success", "Review Deleted");
		res.redirect(`/campgrounds/${id}`);
	})
);

module.exports = router;
