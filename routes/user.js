const express = require('express')
const router = express.Router()

const passport = require('../config/passport')
const userController = require('../controllers/userController')
const validateSignup = require('../middleware/validateSignup')
const validateSignin = require('../middleware/validateSignin')

// user sign up
router.route('/signup')
  .get(userController.signupPage)
  .post(validateSignup, userController.signup)

// uesr sign in
router.route('/signin')
  .get(userController.signinPage)
  .post(validateSignin, passport.authenticate('local', { failureRedirect: '/users/signin', failureFlash: true }), userController.signin)

// user logout
router.get('/logout', userController.logout)

module.exports = router