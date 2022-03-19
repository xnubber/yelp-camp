const express = require('express')
const path = require('path')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
const port = 3000

const passport = require('./config/passport')
const ExpressError = require('./utils/ExpressError')
const campgroundRoutes = require('./routes/campground')
const userRoutes = require('./routes/user')
const errorHandler = require('./middleware/errorHandler')
const { authenticator} = require('./middleware/auth')

// mongoose
require('./config/mongoose')

const app = express()

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({
  secret: 'thisismysecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use((req,res,next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  next()
})


app.get('/', (req, res) => {
  res.render('home')
})
app.use('/users', userRoutes)
app.use('/campgrounds', authenticator, campgroundRoutes)
app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
})

// error handler
app.use(errorHandler)


app.listen(port, () => {
  console.log(`Serving on port ${port}`)
})