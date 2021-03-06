const { campgroundSchema, reviewSchema } = require("./Schemas");
const ExpressError = require('./utils/ExpressError');
const Campground = require("./models/campgrounds");
const Review = require('./models/reviews');


module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
		req.flash('error', 'you must be signed in')
		return res.redirect('/login');
	  }
      next();
}

module.exports.validateCampground = (req, res, next) => {
	const { error } = campgroundSchema.validate(req.body);
	if (error) {
		const errMsg = error.details.map((el) => el.message).join(",");
		throw new ExpressError(errMsg, 400);
	} else {
		next();
	}
};

module.exports.isCreator = async(req,res,next) => {
	const {id} = req.params
	const campground = await Campground.findById(id);
	if(!campground.creator.equals(req.user.id)){
		req.flash('error', `Only the creator can make changes to this campground`)
		return res.redirect(`/campgrounds/${campground._id}`);
	}
	next();
}

module.exports.isReviewCreator = async(req,res,next) => {
	const {id, reviewId} = req.params
	const review = await Review.findById(reviewId);
	if(!review.creator.equals(req.user.id)){
		req.flash('error', `Only the creator can make changes to this campground`)
		return res.redirect(`/campgrounds/${id}`);
	}
	next();
}

module.exports.validateReview = (req, res, next) => {
	const { error } = reviewSchema.validate(req.body);
	if (error) {
		const errMsg = error.details.map((el) => el.message).join(",");
		throw new ExpressError(errMsg, 400);
	} else {
		next();
	}
};