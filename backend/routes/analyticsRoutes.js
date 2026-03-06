const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { adminAuth } = require('../middleware/authMiddleware');

// Admin only routes - analytics dashboard
router.get('/dashboard', adminAuth, analyticsController.getDashboardStats);
router.get('/sales', adminAuth, analyticsController.getSalesAnalytics);
router.get('/top-items', adminAuth, analyticsController.getTopSellingItems);
router.get('/customers', adminAuth, analyticsController.getCustomerAnalytics);
router.get('/orders', adminAuth, analyticsController.getOrderAnalytics);
router.get('/revenue', adminAuth, analyticsController.getRevenueAnalytics);

module.exports = router;
