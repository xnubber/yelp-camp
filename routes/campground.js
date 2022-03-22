const express = require('express')
const router = express.Router()
const multer = require('multer')

const campgroundController = require('../controllers/campgroundController')
const reviewController = require('../controllers/reviewController')
const validateCampground = require('../middleware/validateCampground')
const validateReview = require('../middleware/validateReview')
const isCampExistAndAuthor = require('../middleware/isExistAndAuthor')
const { storage } = require('../config/cloudinary')
const upload = multer({ storage })

// all campgrounds
router.get('/', campgroundController.getCampgrounds)

// create a campground
router.get('/new', campgroundController.getNewCampgroundPage)
router.post('/', upload.array('image'), validateCampground, campgroundController.postCampground)

// read a campground detail
router.get('/:id', campgroundController.getCampground)

// update a campground
router.get('/:id/edit', isCampExistAndAuthor, campgroundController.getUpdateCampgroundPage)
router.put('/:id', isCampExistAndAuthor, upload.array('image'), validateCampground, campgroundController.updateCampground)

// delete a campground
router.delete('/:id', isCampExistAndAuthor, campgroundController.deleteCampground)

// add a review
router.post('/:id/reviews', validateReview, reviewController.postReview)

// delete a review
router.delete('/:campId/reviews/:reviewId', reviewController.deleteReview)

module.exports = router