const Campground = require('../models/campgrounds')
const {cloudinary} = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken =  process.env.MAPBOX_TOKEN;

const geoCoder = mbxGeocoding({accessToken: mapboxToken})



module.exports.index = async function(req, res){
    function escapeRegex(text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    };
    
    if(req.query.q){
        const regex = new RegExp(escapeRegex(req.query.q),'gi')
        const campgrounds = await Campground.find({title: regex});

        if(!campgrounds.length){
            
            req.flash("error", "Cannot find that campground ");
            return res.redirect('/campgrounds')
        }
                res.render("campgrounds/index", { campgrounds });
        
    }
    else{
        const campgrounds = await Campground.find({});
        res.render("campgrounds/index", { campgrounds });  
    }
    
  
}


module.exports.newForm = (req, res) => {
    res.render("campgrounds/new");
  }

module.exports.createNew = async (req, res, next) => {
const geoData = await geoCoder.forwardGeocode({
       query: req.body.campground.location,
       limit: 1
   }).send()
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
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
    const imgs = req.files.map(file => ({url: file.path,filename: file.filename}))
    campground.images.push(...imgs);
    await campground.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
         await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
    }
 
    req.flash("success", "Updated Campground ");
    return res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.delete = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Campground Deleted");
    return res.redirect(`/campgrounds`);
}

