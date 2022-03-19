const Review = require('../models/review')
const Campground = require('../models/campground')
const catchAsync = require('../utils/catchAsync')

const reviewController = {
  postReview: catchAsync(async (req, res, next) => {
    const campgroundId = req.params.id
    const campground = await Campground.findById(campgroundId)
    if (!campground) throw new ExpressError("Campground doesn't exist", 500)

    const review = new Review(req.body.review)
    campground.reviews.push(review)
    review.campground = campground
    await review.save()
    await campground.save()
    req.flash('success', 'Successfully created a review')
    res.redirect(`/campgrounds/${campgroundId}`)
  }),
  deleteReview: catchAsync(async (req, res, next) => {
    const { campId, reviewId } = req.params
    await Campground.findByIdAndUpdate(campId, { $pull: { reviews: reviewId } })
    if (!campground) throw new ExpressError("Campground doesn't exist", 500)
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Successfully deleted a review')
    res.redirect(`/campgrounds/${campId}`)
  })
}

module.exports = reviewController