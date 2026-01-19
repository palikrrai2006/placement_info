const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get placement statistics
router.get('/stats', async (req, res) => {
  try {
    // Total students
    const [totalStudents] = await db.query('SELECT COUNT(*) as count FROM students');
    
    // Total applications
    const [totalApplications] = await db.query('SELECT COUNT(*) as count FROM applications');
    
    // Placed students (status = 'selected')
    const [placedStudents] = await db.query(
      "SELECT COUNT(DISTINCT student_id) as count FROM applications WHERE status = 'selected'"
    );
    
    // Active jobs
    const [activeJobs] = await db.query(
      "SELECT COUNT(*) as count FROM jobs WHERE status = 'active'"
    );
    
    // Average package
    const [avgPackage] = await db.query(
      'SELECT AVG((package_min + package_max) / 2) as average FROM jobs WHERE status = "active"'
    );

    res.json({
      success: true,
      data: {
        totalStudents: totalStudents[0].count,
        totalApplications: totalApplications[0].count,
        placedStudents: placedStudents[0].count,
        activeJobs: activeJobs[0].count,
        averagePackage: avgPackage[0].average || 0,
        placementRate: totalStudents[0].count > 0 
          ? ((placedStudents[0].count / totalStudents[0].count) * 100).toFixed(2)
          : 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get department-wise statistics
router.get('/departments', async (req, res) => {
  try {
    const [departments] = await db.query(`
      SELECT 
        s.department,
        COUNT(DISTINCT s.id) as total_students,
        COUNT(DISTINCT CASE WHEN a.status = 'selected' THEN s.id END) as placed_students,
        AVG(s.cgpa) as average_cgpa,
        ROUND((COUNT(DISTINCT CASE WHEN a.status = 'selected' THEN s.id END) / COUNT(DISTINCT s.id)) * 100, 2) as placement_rate
      FROM students s
      LEFT JOIN applications a ON s.id = a.student_id
      GROUP BY s.department
      ORDER BY placement_rate DESC
    `);

    res.json({ success: true, data: departments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get top skills in demand
router.get('/skills', async (req, res) => {
  try {
    const [skills] = await db.query(`
      SELECT 
        skill_name,
        COUNT(*) as demand_count,
        AVG(proficiency_level) as avg_proficiency
      FROM student_skills
      GROUP BY skill_name
      ORDER BY demand_count DESC
      LIMIT 10
    `);

    res.json({ success: true, data: skills });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get top companies by placements
router.get('/companies', async (req, res) => {
  try {
    const [companies] = await db.query(`
      SELECT 
        c.name,
        c.industry,
        COUNT(DISTINCT a.id) as total_applications,
        COUNT(DISTINCT CASE WHEN a.status = 'selected' THEN a.id END) as placements,
        AVG((j.package_min + j.package_max) / 2) as avg_package
      FROM companies c
      LEFT JOIN jobs j ON c.id = j.company_id
      LEFT JOIN applications a ON j.id = a.job_id
      GROUP BY c.id
      ORDER BY placements DESC
      LIMIT 10
    `);

    res.json({ success: true, data: companies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get application status distribution
router.get('/applications/status', async (req, res) => {
  try {
    const [statusData] = await db.query(`
      SELECT 
        status,
        COUNT(*) as count
      FROM applications
      GROUP BY status
    `);

    res.json({ success: true, data: statusData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get package distribution
router.get('/package-distribution', async (req, res) => {
  try {
    const [packageData] = await db.query(`
      SELECT 
        CASE 
          WHEN (j.package_min + j.package_max) / 2 < 5 THEN '0-5 LPA'
          WHEN (j.package_min + j.package_max) / 2 < 10 THEN '5-10 LPA'
          WHEN (j.package_min + j.package_max) / 2 < 15 THEN '10-15 LPA'
          WHEN (j.package_min + j.package_max) / 2 < 20 THEN '15-20 LPA'
          ELSE '20+ LPA'
        END as package_range,
        COUNT(DISTINCT a.student_id) as count
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE a.status = 'selected'
      GROUP BY package_range
      ORDER BY 
        CASE 
          WHEN package_range = '0-5 LPA' THEN 1
          WHEN package_range = '5-10 LPA' THEN 2
          WHEN package_range = '10-15 LPA' THEN 3
          WHEN package_range = '15-20 LPA' THEN 4
          ELSE 5
        END
    `);

    // Ensure all ranges are present
    const ranges = ['0-5 LPA', '5-10 LPA', '10-15 LPA', '15-20 LPA', '20+ LPA'];
    const distribution = ranges.map(range => {
      const found = packageData.find(p => p.package_range === range);
      return {
        range,
        count: found ? found.count : 0
      };
    });

    res.json({ success: true, data: distribution });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
