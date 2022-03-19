const mongoose = require('mongoose')
const Schema = mongoose.Schema

const reviewSchema = new Schema({
  content: String,
  rating: Number,
  campground: {
    type: Schema.Types.ObjectId,
    ref: 'Campground'
  },
  createdAt: {
    type: Date,
    default: new Date()
  }
})

module.exports = mongoose.model('Review', reviewSchema)