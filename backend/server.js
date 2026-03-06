const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');

const app = express();
const PORT = 5000;

// Connect to database
connectDB();

// CORS enabled for multiple frontends
const allowedOrigins = [
    process.env.ADMIN_URL || 'http://localhost:3000',
    process.env.USER_URL || 'http://localhost:3001',
    'http://127.0.0.1:3000', // Admin frontend (localhost alternative)
    'http://127.0.0.1:3001',  // User frontend (localhost alternative)
    'http://127.0.0.1:5500',  // Frontend development server (127.0.0.1:5500)
    'http://localhost:5500'   // Frontend development server (localhost:5500)
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// JSON middleware
app.use(express.json());

// Route imports
app.use('/api/menu', require('./routes/menuRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/combos', require('./routes/comboRoutes'));
app.use('/api/offers', require('./routes/offerRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// TEMPORARY: Test endpoints for admin dashboard without authentication
app.get('/api/orders-test', async (req, res) => {
    try {
        const Order = require('./models/Order');
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching orders",
            error: error.message
        });
    }
});

app.patch('/api/orders-test/:id', async (req, res) => {
    try {
        const Order = require('./models/Order');
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
            message: "Error updating order",
            error: error.message
        });
    }
});

// TEMPORARY: Test endpoints for combos without authentication
app.get('/api/combos-test', async (req, res) => {
    try {
        const Combo = require('./models/Combo');
        const combos = await Combo.find()
            .populate('items.menuItemId', 'name price')
            .sort({ name: 1 });
        res.json(combos);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching combos",
            error: error.message
        });
    }
});

app.post('/api/combos-test', async (req, res) => {
    try {
        const Combo = require('./models/Combo');
        const combo = new Combo(req.body);
        await combo.save();
        const savedCombo = await Combo.findById(combo._id)
            .populate('items.menuItemId', 'name price');
        res.status(201).json(savedCombo);
    } catch (error) {
        res.status(400).json({
            message: "Error creating combo",
            error: error.message
        });
    }
});

app.put('/api/combos-test/:id', async (req, res) => {
    try {
        const Combo = require('./models/Combo');
        const combo = await Combo.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('items.menuItemId', 'name price');
        
        if (!combo) {
            return res.status(404).json({ error: 'Combo not found' });
        }
        
        res.json(combo);
    } catch (error) {
        res.status(400).json({
            message: "Error updating combo",
            error: error.message
        });
    }
});

app.delete('/api/combos-test/:id', async (req, res) => {
    try {
        const Combo = require('./models/Combo');
        const combo = await Combo.findByIdAndDelete(req.params.id);
        
        if (!combo) {
            return res.status(404).json({ error: 'Combo not found' });
        }
        
        res.json({ message: 'Combo deleted successfully' });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting combo",
            error: error.message
        });
    }
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
