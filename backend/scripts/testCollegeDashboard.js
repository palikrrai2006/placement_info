require('dotenv').config();
const db = require('../config/database');

async function testDashboard() {
  try {
    console.log('\n=== TESTING COLLEGE DASHBOARD QUERIES ===\n');
    
    // 1. Dashboard Stats
    console.log('1. Dashboard Stats:');
    const [stats] = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM students) as total_students,
        (SELECT COUNT(*) FROM companies) as total_companies,
        (SELECT COUNT(DISTINCT j.id) FROM jobs j WHERE j.status = 'active' AND j.deadline >= CURDATE()) as active_drives,
        (SELECT COUNT(DISTINCT a.student_id) FROM applications a WHERE a.status = 'selected') as placements
    `);
    console.log(stats[0]);
    
    // 2. Recent Students
    console.log('\n2. Recent Students (Top 5):');
    const [students] = await db.query(`
      SELECT 
        s.id, s.full_name, s.email, s.department, s.year, s.cgpa,
        CASE 
          WHEN EXISTS (SELECT 1 FROM applications a WHERE a.student_id = s.id AND a.status = 'selected') 
          THEN 'Placed' 
          ELSE 'Not Placed' 
        END as placement_status
      FROM students s
      ORDER BY s.created_at DESC
      LIMIT 5
    `);
    console.log(students);
    
    // 3. Active Companies
    console.log('\n3. Active Companies:');
    const [companies] = await db.query(`
      SELECT 
        c.id, c.name, c.industry, c.location,
        COUNT(DISTINCT j.id) as active_jobs
      FROM companies c
      LEFT JOIN jobs j ON c.id = j.company_id AND j.status = 'active' AND j.deadline >= CURDATE()
      GROUP BY c.id
      HAVING active_jobs > 0
      ORDER BY active_jobs DESC
      LIMIT 5
    `);
    console.log(companies);
    
    // 4. Branch-wise Placement
    console.log('\n4. Branch-wise Placement Stats:');
    const [branchStats] = await db.query(`
      SELECT 
        s.department,
        COUNT(DISTINCT s.id) as total_students,
        COUNT(DISTINCT CASE WHEN a.status = 'selected' THEN s.id END) as placed_students,
        ROUND((COUNT(DISTINCT CASE WHEN a.status = 'selected' THEN s.id END) / COUNT(DISTINCT s.id)) * 100, 1) as placement_percentage
      FROM students s
      LEFT JOIN applications a ON s.id = a.student_id
      GROUP BY s.department
      ORDER BY placement_percentage DESC
    `);
    console.log(branchStats);
    
    // 5. Application Status Breakdown
    console.log('\n5. Application Status Breakdown:');
    const [statusBreakdown] = await db.query(`
      SELECT 
        status,
        COUNT(*) as count
      FROM applications
      GROUP BY status
      ORDER BY count DESC
    `);
    console.log(statusBreakdown);
    
    console.log('\n✅ All queries executed successfully!');
    console.log('Your college dashboard should work with the existing data.');
    
    await db.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testDashboard();
