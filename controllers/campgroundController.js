const Campground = require('../models/campground')
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const { cloudinary } = require('../config/cloudinary')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })

const campgroundController = {
  getCampgrounds: catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
  }),
  getNewCampgroundPage: (req, res) => {
    res.render('campgrounds/new')
  },
  postCampground: catchAsync(async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
      query: req.body.campground.location,
      limit: 1
    }).send()
    console.log(geoData)
    const campground = new Campground(req.body.campground)
    campground.geometry = geoData.body.features[0].geometry
    campground.image = req.files.map(f => ({ url: f.path, filename: f.filename }))
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
    if (!campground) throw new ExpressError("Campground didn't exist", 500)
    res.render('campgrounds/show', { campground })
  }),
  getUpdateCampgroundPage: catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    res.render('campgrounds/edit', { campground })
  }),
  updateCampground: catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    const images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.image.push(...images)
    await campground.save()
    if (req.body.deleteImages) {
      if (campground.image.length === req.body.deleteImages.length) {
        req.flash('error', "You can't delete all images")
        return res.redirect(`/campgrounds/${campground._id}`)
      }
      for (let filename of req.body.deleteImages) {
        await cloudinary.uploader.destroy(filename)
      }
      await campground.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImages } } } })
    }
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