const { signinSchema } = require('./validateSchema')
const ExpressError = require('../utils/ExpressError')

const validateSignin = (req, res, next) => {
  const { error } = signinSchema.validate(req.body)
  if (error) {
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
}

module.exports = validateSignin