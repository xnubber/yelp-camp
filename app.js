const express = require('express')
const path = require('path')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const port = 3000


const ExpressError = require('./utils/ExpressError')
const routes = require('./routes')
const errorHandler = require('./middleware/errorHandler')

// mongoose
require('./config/mongoose')

const app = express()

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))


app.get('/', (req, res) => {
  res.render('home')
})
app.use('/campgrounds', routes)
app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
})

// error handler
app.use(errorHandler)


app.listen(port, () => {
  console.log(`Serving on port ${port}`)
})