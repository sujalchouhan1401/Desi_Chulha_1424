const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { adminAuth } = require('../middleware/authMiddleware');

// Order creation - NO AUTHENTICATION REQUIRED
router.post('/', orderController.createOrder);

// Admin routes - admins can view and update all orders
router.get('/', adminAuth, orderController.getAllOrders);
router.patch('/:id', adminAuth, orderController.updateOrderStatus);

// User can view their own orders (requires authentication)
router.get('/my-orders', require('../middleware/authMiddleware').auth, orderController.getMyOrders);

module.exports = router;
