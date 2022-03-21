const Campground = require('../models/campground')
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')

const campgroundController = {
  getCampgrounds: catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
  }),
  getNewCampgroundPage: (req, res) => {
    res.render('campgrounds/new')
  },
  postCampground: catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground)
    campground.author = req.user._id
    await campground.save()
    req.flash('success', 'Successfully created a new campground')
    res.redirect(`/campgrounds/${campground._id}`)
  }),
  getCampground: catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
      path: 'reviews',
      populate: {
        path: 'author'
      }
    }).populate('author')
    if(!campground) throw new ExpressError("Campground didn't exist", 500)
    res.render('campgrounds/show', { campground })
  }),
  getUpdateCampgroundPage: catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    res.render('campgrounds/edit', { campground })
  }),
  updateCampground: catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    req.flash('success', 'Successfully updated a campground')
    res.redirect(`/campgrounds/${campground._id}`)
  }),
  deleteCampground: catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted a campground')
    res.redirect('/campgrounds')
  })
}

module.exports = campgroundController