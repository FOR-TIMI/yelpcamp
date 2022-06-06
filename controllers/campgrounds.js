const Campground = require('../models/campgrounds')


module.exports.index = async function(req, res){
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
}


module.exports.newForm = (req, res) => {
    res.render("campgrounds/new");
  }

module.exports.createNew = async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.images =req.files.map(file => ({url: file.path,filename: file.filename}));
    campground.creator = req.user._id;
    await campground.save();
    req.flash("success", "Campground created successfully");
    return res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.show = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({path :"reviews", populate:{
        path: 'creator'
    }}).populate('creator');
    if (!campground) {
        req.flash("error", "Cannot find that campground ");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/details", { campground });
}

module.exports.editForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash("error", "Cannot find that campground ");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
}

module.exports.edit = async (req, res) => {
	
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    req.flash("success", "Updated Campground ");
    return res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.delete = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Campground Deleted");
    return res.redirect(`/campgrounds`);
}

