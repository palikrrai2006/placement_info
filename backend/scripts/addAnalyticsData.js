require('dotenv').config();
const db = require('../config/database');

async function addMoreData() {
  try {
    console.log('📊 Adding more data for better analytics...\n');

    // Add more skills to existing students
    const skillsData = [
      // More varied skills for analytics
      [1, 'TypeScript', 'Advanced', 1.5, 'Programming'],
      [1, 'Docker', 'Intermediate', 1.0, 'DevOps'],
      [1, 'AWS', 'Intermediate', 1.0, 'Cloud'],
      [2, 'Data Science', 'Advanced', 2.0, 'Analytics'],
      [2, 'SQL', 'Advanced', 2.0, 'Database'],
      [3, 'Microservices', 'Intermediate', 1.0, 'Architecture'],
      [3, 'REST API', 'Advanced', 1.5, 'Backend'],
      [38, 'JavaScript', 'Intermediate', 1.0, 'Programming'],
      [38, 'React', 'Intermediate', 1.0, 'Framework'],
      [38, 'HTML', 'Advanced', 2.0, 'Frontend'],
      [38, 'CSS', 'Advanced', 2.0, 'Frontend'],
      [38, 'Git', 'Intermediate', 1.5, 'Tools'],
    ];

    for (const skill of skillsData) {
      try {
        await db.query(
          'INSERT INTO student_skills (student_id, skill_name, proficiency_level, years_experience, category) VALUES (?, ?, ?, ?, ?)',
          skill
        );
        console.log(`✅ Added skill ${skill[1]} for student ${skill[0]}`);
      } catch (error) {
        if (error.code !== 'ER_DUP_ENTRY') {
          console.log(`⚠️  Skipped: ${error.message}`);
        }
      }
    }

    // Add more applications to increase data
    const applicationsData = [
      [1, 2, 'under-review', 'Applying for frontend role'],
      [2, 3, 'shortlisted', 'Interested in full stack position'],
      [3, 2, 'applied', 'Would love to join'],
      [38, 1, 'applied', 'Excited about this opportunity'],
      [38, 2, 'applied', 'Perfect match for my skills'],
    ];

    for (const app of applicationsData) {
      try {
        await db.query(
          'INSERT INTO applications (student_id, job_id, status, cover_letter) VALUES (?, ?, ?, ?)',
          app
        );
        console.log(`✅ Added application for student ${app[0]} to job ${app[1]}`);
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          console.log(`⚠️  Application already exists for student ${app[0]}`);
        } else {
          console.log(`⚠️  ${error.message}`);
        }
      }
    }

    // Update some applications to 'selected' status for better placement stats
    const placementUpdates = [
      [1, 2], // Student 1, Job 2
      [2, 3], // Student 2, Job 3
      [3, 1], // Student 3, Job 1
    ];

    for (const [studentId, jobId] of placementUpdates) {
      try {
        await db.query(
          "UPDATE applications SET status = 'selected' WHERE student_id = ? AND job_id = ?",
          [studentId, jobId]
        );
        console.log(`✅ Marked student ${studentId} as placed in job ${jobId}`);
      } catch (error) {
        console.log(`⚠️  ${error.message}`);
      }
    }

    console.log('\n📈 Final Statistics:\n');

    const [students] = await db.query('SELECT COUNT(*) as count FROM students');
    console.log(`✅ Total Students: ${students[0].count}`);

    const [skills] = await db.query('SELECT COUNT(*) as count FROM student_skills');
    console.log(`✅ Total Skills: ${skills[0].count}`);

    const [applications] = await db.query('SELECT COUNT(*) as count FROM applications');
    console.log(`✅ Total Applications: ${applications[0].count}`);

    const [placed] = await db.query("SELECT COUNT(DISTINCT student_id) as count FROM applications WHERE status = 'selected'");
    console.log(`✅ Placed Students: ${placed[0].count}`);

    const [placementRate] = await db.query(`
      SELECT 
        ROUND((COUNT(DISTINCT CASE WHEN a.status = 'selected' THEN a.student_id END) / COUNT(DISTINCT s.id)) * 100, 1) as rate
      FROM students s
      LEFT JOIN applications a ON s.id = a.student_id
    `);
    console.log(`✅ Overall Placement Rate: ${placementRate[0].rate}%`);

    console.log('\n🎯 Top Skills by Demand:\n');
    const [topSkills] = await db.query(`
      SELECT skill_name, COUNT(*) as count
      FROM student_skills
      GROUP BY skill_name
      ORDER BY count DESC
      LIMIT 10
    `);
    
    topSkills.forEach((skill, idx) => {
      console.log(`  ${idx + 1}. ${skill.skill_name}: ${skill.count} students`);
    });

    console.log('\n📊 Department-wise Placement:\n');
    const [deptStats] = await db.query(`
      SELECT 
        s.department,
        COUNT(DISTINCT s.id) as total,
        COUNT(DISTINCT CASE WHEN a.status = 'selected' THEN s.id END) as placed,
        ROUND((COUNT(DISTINCT CASE WHEN a.status = 'selected' THEN s.id END) / COUNT(DISTINCT s.id)) * 100, 1) as rate
      FROM students s
      LEFT JOIN applications a ON s.id = a.student_id
      GROUP BY s.department
      HAVING total > 0
      ORDER BY rate DESC
    `);
    
    deptStats.forEach(dept => {
      console.log(`  ${dept.department}: ${dept.placed}/${dept.total} (${dept.rate}%)`);
    });

    console.log('\n✅ All done! Analytics page should now show comprehensive data.');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit();
  }
}

addMoreData();
