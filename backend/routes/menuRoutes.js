const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { adminAuth, optionalAuth } = require('../middleware/authMiddleware');

// Public routes - anyone can view menu
router.get('/', optionalAuth, menuController.getAllMenuItems);

// Admin only routes
router.post('/', adminAuth, menuController.createMenuItem);
router.put('/:id', adminAuth, menuController.updateMenuItem);
router.delete('/:id', adminAuth, menuController.deleteMenuItem);

module.exports = router;
