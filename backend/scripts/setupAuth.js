const db = require('../config/database');

async function checkAndAddColumn() {
  try {
    const [cols] = await db.query("SHOW COLUMNS FROM students WHERE Field = 'password_hash'");
    
    if (cols.length === 0) {
      console.log('Adding password_hash column...');
      await db.query('ALTER TABLE students ADD COLUMN password_hash VARCHAR(255) NULL');
      console.log('✅ Column added successfully');
    } else {
      console.log('✅ password_hash column already exists');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkAndAddColumn();
