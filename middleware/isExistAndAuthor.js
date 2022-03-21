const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campground')

const isCampExistAndAuthor = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const campground = await Campground.findById(id).populate('author')
  if (!campground) throw new ExpressError("Campground didn't exist", 500)
  if (campground.author.username !== req.user.username) throw new ExpressError("You can't edit or delete this campground", 500)
  next()
})

module.exports = isCampExistAndAuthor