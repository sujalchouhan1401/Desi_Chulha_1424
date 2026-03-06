const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, adminAuth } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes
router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);
router.put('/change-password', auth, userController.changePassword);

// Admin only routes
router.get('/all', adminAuth, userController.getAllUsers);
router.post('/create-admin', userController.createAdmin);

module.exports = router;
