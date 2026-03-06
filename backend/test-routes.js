const orderRoutes = require('./routes/orderRoutes');
const express = require('express');

const app = express();
app.use(express.json());

// Test the routes
app.use('/api/orders', orderRoutes);

app.listen(5001, () => {
  console.log('Test server running on port 5001');
  
  // Test the route
  const http = require('http');
  
  const data = JSON.stringify({
    customerName: 'Test',
    phone: '1234567890',
    items: [{name: 'Test Item', quantity: 1, price: 100}],
    totalAmount: 100
  });

  const options = {
    hostname: 'localhost',
    port: 5001,
    path: '/api/orders',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
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
      process.exit(0);
    });
  });

  req.on('error', (err) => {
    console.error('Error:', err.message);
    process.exit(1);
  });

  req.write(data);
  req.end();
});
