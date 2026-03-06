const express = require('express');
const router = express.Router();
const comboController = require('../controllers/comboController');
const { adminAuth, optionalAuth } = require('../middleware/authMiddleware');

// Public routes - anyone can view active combos
router.get('/', optionalAuth, comboController.getAllCombos);

// Admin only routes
router.post('/', adminAuth, comboController.createCombo);

module.exports = router;
