require('dotenv').config();
const db = require('../config/database');
const fs = require('fs');
const path = require('path');

async function setupAnalyticsData() {
  try {
    console.log('📊 Setting up analytics data...\n');

    // Read the SQL file
    const sqlFile = path.join(__dirname, '../database/analytics_data.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');

    // Split by semicolon and filter empty statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--') && !stmt.startsWith('SELECT'));

    console.log(`Found ${statements.length} SQL statements to execute\n`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.includes('INSERT INTO')) {
        try {
          await db.query(statement);
          const tableName = statement.match(/INSERT INTO (\w+)/)[1];
          console.log(`✅ Inserted data into ${tableName}`);
        } catch (error) {
          if (error.code === 'ER_DUP_ENTRY') {
            console.log(`⚠️  Skipping duplicate entry`);
          } else {
            console.error(`❌ Error: ${error.message}`);
          }
        }
      }
    }

    console.log('\n📈 Verification:\n');

    // Verify data
    const [students] = await db.query('SELECT COUNT(*) as count FROM students');
    console.log(`✅ Total Students: ${students[0].count}`);

    const [skills] = await db.query('SELECT COUNT(*) as count FROM student_skills');
    console.log(`✅ Total Skills: ${skills[0].count}`);

    const [companies] = await db.query('SELECT COUNT(*) as count FROM companies');
    console.log(`✅ Total Companies: ${companies[0].count}`);

    const [jobs] = await db.query('SELECT COUNT(*) as count FROM jobs');
    console.log(`✅ Total Jobs: ${jobs[0].count}`);

    const [applications] = await db.query('SELECT COUNT(*) as count FROM applications');
    console.log(`✅ Total Applications: ${applications[0].count}`);

    const [placed] = await db.query("SELECT COUNT(DISTINCT student_id) as count FROM applications WHERE status = 'selected'");
    console.log(`✅ Placed Students: ${placed[0].count}`);

    console.log('\n🎯 Department-wise Stats:\n');
    const [deptStats] = await db.query(`
      SELECT 
        s.department,
        COUNT(DISTINCT s.id) as total_students,
        COUNT(DISTINCT CASE WHEN a.status = 'selected' THEN s.id END) as placed,
        ROUND((COUNT(DISTINCT CASE WHEN a.status = 'selected' THEN s.id END) / COUNT(DISTINCT s.id)) * 100, 1) as placement_rate
      FROM students s
      LEFT JOIN applications a ON s.id = a.student_id
      GROUP BY s.department
      ORDER BY placement_rate DESC
    `);
    
    deptStats.forEach(dept => {
      console.log(`${dept.department}: ${dept.placed}/${dept.total_students} placed (${dept.placement_rate}%)`);
    });

    console.log('\n🔥 Top 5 Skills:\n');
    const [topSkills] = await db.query(`
      SELECT skill_name, COUNT(*) as count
      FROM student_skills
      GROUP BY skill_name
      ORDER BY count DESC
      LIMIT 5
    `);
    
    topSkills.forEach((skill, idx) => {
      console.log(`${idx + 1}. ${skill.skill_name}: ${skill.count} students`);
    });

    console.log('\n✅ Analytics data setup complete!');
    console.log('\n💡 You can now access analytics at: http://localhost:5174/student/analytics');

  } catch (error) {
    console.error('❌ Error setting up analytics data:', error.message);
  } finally {
    process.exit();
  }
}

setupAnalyticsData();
