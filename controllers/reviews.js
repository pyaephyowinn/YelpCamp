const Review = require('../models/review');
const Campground = require('../models/campground');

module.exports.createReviews = async (req, res) => {
   let campground = await Campground.findById(req.params.id);
   let review = new Review(req.body.review);
   review.author = req.user._id;
   campground.reviews.push(review);
   await review.save();
   await campground.save();
   req.flash('success', 'Successfully added a review.')
   res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteReviews = async (req, res) => {
   let {id , reviewId} = req.params;
   await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
   await Review.findByIdAndDelete(reviewId);
   req.flash('success', 'Successfully deleted the review.')
   res.redirect(`/campgrounds/${id}`);
}