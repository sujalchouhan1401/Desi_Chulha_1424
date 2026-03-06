const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 5002;

// CORS
app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// JSON middleware
app.use(express.json());

// Test route - NO AUTHENTICATION
app.post('/api/orders', (req, res) => {
    try {
        console.log('📝 Order creation request received');
        console.log('📦 Request body:', JSON.stringify(req.body, null, 2));
        
        // Mock order creation
        const mockOrder = {
            _id: 'mock-order-' + Date.now(),
            ...req.body,
            status: 'Pending',
            createdAt: new Date()
        };
        
        console.log('✅ Order created successfully:', mockOrder._id);
        res.status(201).json(mockOrder);
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
        message: 'Fresh server is running',
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Fresh server running on http://localhost:${PORT}`);
    
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
                    console.log('✅ SUCCESS: Order creation works without authentication!');
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
    }, 1000);
});

module.exports = app;
