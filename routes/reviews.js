const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const {validateReview, isLoggedIn,isReviewCreator} = require('../middleware');
const reviews = require('../controllers/reviews');


//routes

router.post("/",isLoggedIn,validateReview,catchAsync(reviews.createReview));
router.delete("/:reviewId",isLoggedIn,isReviewCreator,catchAsync(reviews.deleteReview));

module.exports = router;
