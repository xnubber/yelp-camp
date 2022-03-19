const User = require('../models/user')
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const bcrypt = require('bcryptjs')

const userController = {
  signupPage: (req, res) => {
    res.render('users/signup')
  },
  signup: catchAsync(async (req, res, next) => {
    const { name, email, password, confirmPassword } = req.body
    const checkUser = await User.findOne({ username: name })
    if (checkUser) {
      req.flash('error', 'User already exists.')
      return res.render('users/signup', { name, email, password, confirmPassword })
    }
    const checkEmail = await User.findOne({ email })
    if (checkEmail) {
      req.flash('error', 'User already exists.')
      return res.render('users/signup', { name, email, password, confirmPassword })
    }
    if (password !== confirmPassword) {
      req.flash('error', 'Password and confirm password must be the same.')
      return res.render('users/signup', { name, email, password, confirmPassword })
    }

    const hash = await bcrypt.hash(password, 10)
    const user = new User({
      username: name,
      email,
      password: hash,
    })
    await user.save()
    req.login(user, err => {
      if (err) return next(err)
      req.flash('success', 'Successfully sign up')
      res.redirect('/campgrounds')
    })
  }),
  signinPage: (req, res) => {
    res.render('users/signin')
  },
  signin: (req, res) => {
    req.flash('success', 'Successfully Sign In')
    res.redirect('/campgrounds')
  },
  logout: (req, res) => {
    req.logout()
    req.flash('success', 'Successfully Logout')
    res.redirect('/users/signin')
  }
}


module.exports = userController