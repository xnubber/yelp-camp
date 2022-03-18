const Review = require('../models/review')
const Campground = require('../models/campground')
const catchAsync = require('../utils/catchAsync')

const reviewController = {
  postReview: catchAsync(async (req, res, next) => {
    const campgroundId = req.params.id
    const campground = await Campground.findById(campgroundId)
    if (!campground) throw new ExpressError("Campground doesn't exist", 400)

    const review = new Review(req.body.review)
    campground.reviews.push(review)
    review.campground = campground
    await review.save()
    await campground.save()
    res.redirect(`/campgrounds/${campgroundId}`)
  }),
  deleteReview: catchAsync(async (req, res, next) => {
    const { campId, reviewId } = req.params
    await Campground.findByIdAndUpdate(campId, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/campgrounds/${campId}`)
  })
}

module.exports = reviewController