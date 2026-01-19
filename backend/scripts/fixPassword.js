const db = require('../config/database');
const bcrypt = require('bcrypt');

async function fixSoniaPassword() {
  try {
    const email = 'sonia.mehta@university.edu';
    const newPassword = '123456';
    
    // Check if user exists
    const [users] = await db.query('SELECT id, email, password_hash FROM students WHERE email = ?', [email]);
    
    if (users.length === 0) {
      console.log('❌ User not found');
      process.exit(1);
    }
    
    console.log('Found user:', users[0].email);
    console.log('Current password_hash:', users[0].password_hash);
    
    // Hash the password properly
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log('\nNew hashed password:', hashedPassword);
    
    // Update the password
    await db.query('UPDATE students SET password_hash = ? WHERE email = ?', [hashedPassword, email]);
    
    console.log('\n✅ Password updated successfully!');
    console.log('Email:', email);
    console.log('Password:', newPassword);
    
    // Test login
    console.log('\nTesting password validation...');
    const isValid = await bcrypt.compare(newPassword, hashedPassword);
    console.log('Validation:', isValid ? '✅ SUCCESS' : '❌ FAILED');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixSoniaPassword();
