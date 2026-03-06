const User = require('./models/User');
require('dotenv').config();

async function createTestUser() {
  try {
    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'test@desichulha.com' });
    if (existingUser) {
      console.log('✅ Test user already exists');
      console.log('📧 Email: test@desichulha.com');
      console.log('🔑 Password: test123');
      console.log('🌐 You can login at: http://localhost:3001/user/index.html');
      return;
    }

    // Create test user
    const testUser = new User({
      name: 'Test User',
      email: 'test@desichulha.com',
      password: 'test123',
      role: 'user'
    });

    await testUser.save();
    console.log('✅ Test user created successfully!');
    console.log('📧 Email: test@desichulha.com');
    console.log('🔑 Password: test123');
    console.log('🌐 You can now login at: http://localhost:3001/user/index.html');
  } catch (error) {
    console.error('Error creating test user:', error);
  }
}

createTestUser();
