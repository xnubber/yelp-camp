const Campground = require('../models/campground')
const catchAsync = require('../utils/catchAsync')

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
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
  }),
  getCampground: catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews')
    res.render('campgrounds/show', { campground })
  }),
  getUpdateCampgroundPage: catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { campground })
  }),
  updateCampground: catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    res.redirect(`/campgrounds/${campground._id}`)
  }),
  deleteCampground: catchAsync(async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
  })
}

module.exports = campgroundController