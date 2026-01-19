const db = require('../config/database');
const bcrypt = require('bcrypt');

async function testSignupStorage() {
  try {
    const testEmail = `test${Date.now()}@example.com`;
    const testPassword = 'testpass123';
    
    console.log('--- Testing Signup Storage ---');
    console.log('Email:', testEmail);
    console.log('Password:', testPassword);
    
    // Hash password
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    console.log('\nHashed password:', hashedPassword.substring(0, 30) + '...');
    
    // Insert
    const [result] = await db.query(
      `INSERT INTO students 
       (full_name, email, password_hash, roll_number, department, year) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      ['Test User', testEmail, hashedPassword, `ROLL${Date.now()}`, 'IT', '4th Year']
    );
    
    console.log('✅ Insert successful, ID:', result.insertId);
    
    // Verify stored
    const [users] = await db.query(
      'SELECT id, email, password_hash FROM students WHERE id = ?',
      [result.insertId]
    );
    
    console.log('\n--- Verification ---');
    console.log('Retrieved email:', users[0].email);
    console.log('Has password_hash:', !!users[0].password_hash);
    console.log('Stored hash:', users[0].password_hash?.substring(0, 30) + '...');
    
    // Test password comparison
    const isValid = await bcrypt.compare(testPassword, users[0].password_hash);
    console.log('Password validation:', isValid ? '✅ SUCCESS' : '❌ FAILED');
    
    // Cleanup
    await db.query('DELETE FROM students WHERE id = ?', [result.insertId]);
    console.log('\n✅ Test completed and cleaned up');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

testSignupStorage();
