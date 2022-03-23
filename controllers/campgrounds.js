const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken});
const {cloudinary} = require('../cloudinary');

module.exports.index = async (req, res) => {
   let campgrounds = await Campground.find({});
   res.render('campgrounds/index', { campgrounds });
}

module.exports.renderNewForm = (req, res) => {
   res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res) => {
   let geoData = await geocoder.forwardGeocode({
      query: req.body.campground.location,
      limit: 1
   }).send();
   let campground = new Campground(req.body.campground);
   campground.geometry = geoData.body.features[0].geometry;
   campground.images = req.files.map(file => ({url: file.path, filename: file.filename}));
   campground.author = req.user._id;
   await campground.save();
   req.flash('success', 'Successfully added a campground.');
   res.redirect(`/campgrounds/${campground._id}`);    
}

module.exports.showCampground = async (req, res) => {
   let { id } = req.params;
   let campground = await Campground.findById(id)
         .populate({ path: 'reviews', populate : { path:'author' }})
         .populate('author');
   if(!campground) {
      req.flash('error', 'Cannot find the campground.');
      return res.redirect('/campgrounds');
   }
   res.render('campgrounds/show', { campground });
}

module.exports.renderEditForm = async (req, res) => {
   let { id } = req.params;
   let campground = await Campground.findById(id);
   if(!campground) {
      req.flash('error', 'Cannot find the campground.');
      return res.redirect('/campgrounds');
   }
   res.render('campgrounds/edit', { campground });
}

module.exports.updateCampground = async (req, res) => {
   let { id } = req.params;
   let campground = await Campground.findByIdAndUpdate(id, req.body.campground);
   let imgs = req.files.map(file => ({url: file.path, filename: file.filename}));
   campground.images.push(...imgs);
   await campground.save();
   if(req.body.deleteImages) {
      for (let filename of req.body.deleteImages) {
         await cloudinary.uploader.destroy(filename);
      }
      await campground.updateOne({$pull: {images: {filename : {$in: req.body.deleteImages}}}})
   }
   req.flash('success', 'Successfully updated the campground.');
   res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async (req, res) => {
   let { id } = req.params;
   await Campground.findByIdAndDelete(id);
   req.flash('success', 'Successfully deleted the campground.');
   res.redirect('/campgrounds');
}