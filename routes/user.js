const express = require('express')
const router = express.Router()

const passport = require('../config/passport')
const userController = require('../controllers/userController')
const validateSignup = require('../middleware/validateSignup')
const validateSignin = require('../middleware/validateSignin')


router.get('/signup', userController.signupPage)
router.post('/signup', validateSignup, userController.signup)

router.get('/signin', userController.signinPage)
router.post('/signin', validateSignin, passport.authenticate('local', { failureRedirect: '/users/signin', failureFlash: true }), userController.signin)

router.get('/logout', userController.logout)

module.exports = router