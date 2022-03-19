const { signupSchema } = require('./validateSchema')
const ExpressError = require('../utils/ExpressError')

const validateSignup = (req, res, next) => {
  const { error } = signupSchema.validate(req.body)
  if (error) {
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
}

module.exports = validateSignup