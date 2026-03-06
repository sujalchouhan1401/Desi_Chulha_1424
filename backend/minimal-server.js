const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = 5001;

// Connect to database
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    bufferMaxEntries: 0,
    bufferCommands: false,
}).then(() => {
    console.log('✅ MongoDB Connected');
}).catch(err => {
    console.error('❌ Database connection error:', err);
});

// CORS
app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// JSON middleware
app.use(express.json());

// Order Schema
const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    items: [{ name: String, quantity: Number, price: Number }],
    totalAmount: { type: Number, required: true },
    status: { type: String, default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// Order creation route - NO AUTHENTICATION
app.post('/api/orders', async (req, res) => {
    try {
        console.log('📝 Order creation request received');
        console.log('📦 Request body:', JSON.stringify(req.body, null, 2));
        
        const order = new Order(req.body);
        const savedOrder = await order.save();
        
        console.log('✅ Order saved successfully:', savedOrder._id);
        res.status(201).json(savedOrder);
    } catch (error) {
        console.error('❌ Error creating order:', error.message);
        res.status(500).json({
            message: "Error creating order",
            error: error.message
        });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Minimal server running on http://localhost:${PORT}`);
    
    // Test the order creation
    setTimeout(() => {
        const http = require('http');
        
        const data = JSON.stringify({
            customerName: 'Test',
            phone: '1234567890',
            items: [{name: 'Test Item', quantity: 1, price: 100}],
            totalAmount: 100
        });

        const options = {
            hostname: 'localhost',
            port: PORT,
            path: '/api/orders',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data),
                'Origin': 'http://127.0.0.1:5500'
            }
        };

        const req = http.request(options, (res) => {
            console.log('Status:', res.statusCode);
            
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            
            res.on('end', () => {
                console.log('Response:', body);
                if (res.statusCode === 201) {
                    console.log('✅ SUCCESS: Order creation works!');
                }
                process.exit(0);
            });
        });

        req.on('error', (err) => {
            console.error('Error:', err.message);
            process.exit(1);
        });

        req.write(data);
        req.end();
    }, 2000);
});

module.exports = app;
