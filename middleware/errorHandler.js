const errorHandler = (err, req, res, next) => {
  const { statusCode = 500, message = 'Something went wrong' } = err
  req.flash('error', `${err.message}`)
  res.status(statusCode).redirect('/campgrounds')
}

module.exports = errorHandler