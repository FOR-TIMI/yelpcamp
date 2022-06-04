const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campgrounds");
const {isLoggedIn,validateCampground,isCreator} = require('../middleware');
const campgrounds = require('../controllers/campgrounds')

router.route("/")
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn,validateCampground,catchAsync(campgrounds.createNew));

router.get("/new", isLoggedIn, campgrounds.newForm);

router.route("/:id")
    .get(catchAsync(campgrounds.show))
    .put(isLoggedIn,isCreator,validateCampground,catchAsync(campgrounds.edit))
    .delete(isLoggedIn,isCreator,catchAsync(campgrounds.delete))


router.get("/:id/edit",isLoggedIn,isCreator,catchAsync(campgrounds.editForm));




module.exports = router;

