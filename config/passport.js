const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const User = require('../models/user')

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  async (req, email, password, cb) => {
    const user = await User.findOne({ email })
    if (!user) return cb(null, false, req.flash('error', 'Email or Password incorrect'))
    const res = await bcrypt.compare(password, user.password)
    if (!res) return cb(null, false, req.flash('error', 'Email or Password incorrect'))
    return cb(null, user)
  }
))

passport.serializeUser((user, cb) => {
  cb(null, user._id)
})

passport.deserializeUser(async (id, cb) => {
  try {
    const user = await User.findOne({ _id: id })
    cb(null, user)
  } catch (err) {
    cb(err)
  }
})

module.exports = passport