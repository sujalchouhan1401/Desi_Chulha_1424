const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');
const { adminAuth, optionalAuth } = require('../middleware/authMiddleware');

// Public routes - anyone can view active offers
router.get('/', optionalAuth, offerController.getAllOffers);

// Admin only routes
router.post('/', adminAuth, offerController.createOffer);

module.exports = router;
