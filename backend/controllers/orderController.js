const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
    try {
        console.log('📝 Backend: Order creation request received');
        console.log('📦 Backend: Request body:', JSON.stringify(req.body, null, 2));
        
        const orderData = {
            ...req.body,
            orderId: 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase()
        };

        // Only attach userId if user is authenticated
        if (req.user && req.user.id) {
            orderData.userId = req.user.id;
            console.log('👤 Backend: Authenticated user, attaching userId');
        } else {
            console.log('👤 Backend: Guest user, no userId attached');
        }

        console.log('💾 Backend: Saving order data:', JSON.stringify(orderData, null, 2));

        const order = new Order(orderData);
        const savedOrder = await order.save();

        console.log('✅ Backend: Order saved successfully:', savedOrder._id);
        
        // Always return JSON response
        res.status(201).json(savedOrder);

    } catch (error) {
        console.error('❌ Backend: Error creating order:', error.message);
        
        // Always return JSON response even for errors
        res.status(500).json({
            message: "Error creating order",
            error: error.message
        });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        console.log('📋 Fetching all orders from database...');
        
        const orders = await Order.find().sort({ createdAt: -1 });
        console.log('✅ Found orders:', orders.length);
        
        res.json(orders);
    } catch (error) {
        console.error('❌ Error fetching orders:', error);
        res.status(500).json({
            message: "Error fetching orders",
            error: error.message
        });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true, runValidators: true }
        );
        
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        res.json(order);
    } catch (error) {
        res.status(500).json({
            message: "Error updating order status",
            error: error.message
        });
    }
};

// Get user's own orders (for authenticated users)
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id })
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching user orders",
            error: error.message
        });
    }
};
