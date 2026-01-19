const db = require('../config/database');

async function checkStorage() {
  try {
    const [users] = await db.query(`
      SELECT id, email, full_name, 
             password_hash IS NOT NULL as has_hash,
             LENGTH(password_hash) as hash_length,
             SUBSTRING(password_hash, 1, 20) as hash_preview
      FROM students 
      WHERE email IN ('demo@test.com', 'test@student.com', 'finaltest@student.com')
      ORDER BY id DESC
    `);

    console.log('\n=== Database Storage Check ===\n');
    console.table(users);

    // Check all recent signups
    const [recent] = await db.query(`
      SELECT id, email, full_name,
             password_hash IS NOT NULL as has_hash,
             created_at
      FROM students 
      ORDER BY id DESC 
      LIMIT 5
    `);

    console.log('\n=== Last 5 Students ===\n');
    console.table(recent);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkStorage();
