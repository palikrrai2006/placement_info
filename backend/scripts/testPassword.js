const db = require('../config/database');
const bcrypt = require('bcrypt');

async function testPasswordValidation() {
  try {
    const [users] = await db.query(
      "SELECT id, email, full_name, password_hash FROM students WHERE email = 'demo@test.com'"
    );

    if (users.length === 0) {
      console.log('❌ User not found');
      process.exit(1);
    }

    const user = users[0];
    console.log('User:', user.email);
    console.log('Has password_hash:', !!user.password_hash);
    console.log('Password hash:', user.password_hash?.substring(0, 20) + '...');

    console.log('\n--- Testing Password Validation ---');
    
    const wrongResult = await bcrypt.compare('wrongpass', user.password_hash);
    console.log('Wrong password (wrongpass):', wrongResult);

    const correctResult = await bcrypt.compare('demo123', user.password_hash);
    console.log('Correct password (demo123):', correctResult);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testPasswordValidation();
