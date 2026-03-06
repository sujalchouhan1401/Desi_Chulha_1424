// Test if frontend can reach backend
const http = require('http');

const testData = {
    customerName: 'Test User',
    phone: '1234567890',
    items: [{name: 'Test Item', quantity: 1, price: 100}],
    totalAmount: 100
};

const options = {
    hostname: 'localhost',
    port: 5002,
    path: '/api/orders',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(JSON.stringify(testData)),
        'Origin': 'http://127.0.0.1:5500'
    }
};

console.log('🧪 Testing frontend-backend connection...');
console.log('📡 Sending request to:', `http://localhost:5002/api/orders`);
console.log('📦 Data:', JSON.stringify(testData, null, 2));

const req = http.request(options, (res) => {
    console.log('✅ Connection successful!');
    console.log('📊 Status:', res.statusCode);
    console.log('📋 Headers:', res.headers);
    
    let body = '';
    res.on('data', (chunk) => {
        body += chunk;
    });
    
    res.on('end', () => {
        console.log('📄 Response:', body);
        
        if (res.statusCode === 201) {
            console.log('🎉 SUCCESS: Frontend can reach backend!');
            console.log('📱 Now test from browser at: http://127.0.0.1:5500/user/pages/cart.html');
        } else {
            console.log('❌ Unexpected status code:', res.statusCode);
        }
    });
});

req.on('error', (err) => {
    console.error('❌ Connection failed:', err.message);
    console.log('💡 Make sure the server is running on port 5002');
});

req.write(JSON.stringify(testData));
req.end();
