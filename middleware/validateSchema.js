const Joi = require('joi')

const campgroundSchema = Joi.object({
  campground: Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(0),
    // image: Joi.string().required(),
    location: Joi.string().required(),
    description: Joi.string().required()
  }).required(),
  deleteImages: Joi.array()
})

const reviewSchema = Joi.object({
  review: Joi.object({
    content: Joi.string().required(),
    rating: Joi.number().required().min(1).max(5)
  }).required()
})

const signupSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
  confirmPassword: Joi.string().required()
})

const signinSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
})

module.exports = {
  campgroundSchema,
  reviewSchema,
  signupSchema,
  signinSchema
}