const { campgroundSchema, reviewSchema } = require('./schemas');
const Campground = require('./models/campground');
const Review = require('./models/review');
const ExpressError = require('./utils/ExrpessError');

module.exports.isLoggedIn = (req, res, next) => {
   if(!req.isAuthenticated()) {
      req.session.returnTo = req.originalUrl;
      req.flash('error', 'You must be signed in.')
      return res.redirect('/login')
   }
   next();
}

module.exports.isAuthor = async (req, res, next) => {
   let { id } = req.params;
   let campground = await Campground.findById(id);

   //bugs at localhost:3000/campgrounds/deleted_id/edit
   if(!campground) {
      req.flash('error', 'Campground not found')
      return res.redirect('/campgrounds')
   }
   if (! campground.author.equals(req.user._id)) {
      req.flash('error', 'You do not have permission');
      return res.redirect(`/campgrounds/${id}`);
   }
   next();
}

module.exports.validateCampground = (req, res, next) => {
   const { error } = campgroundSchema.validate(req.body);
   if(error) {
       const msg = error.details.map(el => el.message).join(',');
       throw new ExpressError(msg, 400);
   } else {
       next();
   }
}
module.exports.validateReview = (req, res, next) => {
   const { error } = reviewSchema.validate(req.body);
   if(error) {
       const msg = error.details.map(el => el.message).join(',');
       throw new ExpressError(msg, 400);
   } else {
       next();
   }
}

module.exports.isReviewAuthor = async (req, res, next) => {
   let { id, reviewId } = req.params;
   let review = await Review.findById(reviewId).populate('author');

   if (! review.author.equals(req.user._id)) {
      req.flash('error', 'You do not have permission');
      return res.redirect(`/campgrounds/${id}`);
   }
   next();
}