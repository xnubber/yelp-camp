const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const Campground = require('./models/campground')
const Review = require('./models/review')
const port = 3000

const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const validateCampground = require('./middleware/validateCampground')



mongoose.connect('mongodb://localhost:27017/yelp-camp')
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log('Database connected')
})

const app = express()

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
  res.render('home')
})

// all campgrounds
app.get('/campgrounds', catchAsync(async (req, res) => {
  const campgrounds = await Campground.find({})
  res.render('campgrounds/index', { campgrounds })
}))

// create a new campground
app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new')
})

app.post('/campgrounds', validateCampground, catchAsync(async (req, res) => {
  const campground = new Campground(req.body.campground)
  await campground.save()
  res.redirect(`/campgrounds/${campground._id}`)
}))

// read a campground page
app.get('/campgrounds/:id', catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id)
  res.render('campgrounds/show', { campground })
}))

// update a campground
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id)
  res.render('campgrounds/edit', { campground })
}))

app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
  const { id } = req.params
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
  res.redirect(`/campgrounds/${campground._id}`)
}))

// delete a campground
app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
  const { id } = req.params
  await Campground.findByIdAndDelete(id)
  res.redirect('/campgrounds')
}))


// add a review
app.post('/campgrounds/:id/reviews', catchAsync(async (req, res) => { 
  const campgroundId = req.params.id
  const campground = await Campground.findById(campgroundId)
  const review = new Review(req.body.review)
  campground.reviews.push(review)
  review.campground = campground
  await review.save()
  await campground.save()
  res.redirect(`/campgrounds/${campgroundId}`)
}))

app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
  const { statusCode = 500, message = 'Something went wrong' } = err
  res.status(statusCode).render('campgrounds/error', { err })
})


app.listen(port, () => {
  console.log(`Serving on port ${port}`)
})