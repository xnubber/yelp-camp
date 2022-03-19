const mongoose = require('mongoose')
const Schema = mongoose.Schema


const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: "https://i.imgur.com/zYddUs8.png"
  }
})



module.exports = mongoose.model('User', userSchema)