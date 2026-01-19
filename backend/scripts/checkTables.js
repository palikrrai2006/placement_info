require('dotenv').config();
const db = require('../config/database');

async function checkTables() {
  try {
    const [tables] = await db.query('SHOW TABLES');
    console.log('\n=== EXISTING TABLES ===');
    console.log(tables);
    
    if (tables.length > 0) {
      console.log('\n=== TABLE STRUCTURES ===');
      for (const table of tables) {
        const tableName = Object.values(table)[0];
        console.log(`\n--- ${tableName} ---`);
        const [columns] = await db.query(`DESCRIBE ${tableName}`);
        console.log(columns);
        
        const [count] = await db.query(`SELECT COUNT(*) as count FROM ${tableName}`);
        console.log(`Total rows: ${count[0].count}`);
      }
    }
    
    await db.end();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkTables();
