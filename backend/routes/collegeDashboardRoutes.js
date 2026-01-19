const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get college dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const [stats] = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM students) as total_students,
        (SELECT COUNT(*) FROM companies) as total_companies,
        (SELECT COUNT(*) FROM jobs WHERE status = 'active') as active_drives,
        (SELECT COUNT(DISTINCT student_id) FROM applications WHERE status = 'selected') as placements_done,
        (SELECT ROUND(AVG((package_min + package_max) / 2), 1) FROM jobs WHERE status = 'active') as avg_package,
        ROUND((SELECT COUNT(DISTINCT student_id) FROM applications WHERE status = 'selected') / 
              (SELECT COUNT(*) FROM students) * 100, 1) as placement_rate
    `);

    res.json({ success: true, data: stats[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get recent students
router.get('/students/recent', async (req, res) => {
  try {
    const limit = req.query.limit || 10;
    const [students] = await db.query(`
      SELECT 
        s.id,
        s.full_name as name,
        s.email,
        s.department as branch,
        s.cgpa,
        CASE 
          WHEN EXISTS (SELECT 1 FROM applications WHERE student_id = s.id AND status = 'selected') 
          THEN 'Placed'
          ELSE 'Eligible'
        END as status,
        s.created_at
      FROM students s
      ORDER BY s.created_at DESC
      LIMIT ?
    `, [parseInt(limit)]);

    res.json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get active companies with job details
router.get('/companies/active', async (req, res) => {
  try {
    const [companies] = await db.query(`
      SELECT 
        c.id,
        c.name,
        c.industry,
        c.logo_url,
        COUNT(DISTINCT j.id) as openings,
        MIN(j.package_min) as package_min,
        MAX(j.package_max) as package_max,
        CONCAT(MIN(j.package_min), '-', MAX(j.package_max), ' LPA') as package_range,
        'Active' as status
      FROM companies c
      LEFT JOIN jobs j ON c.id = j.company_id AND j.status = 'active'
      GROUP BY c.id, c.name, c.industry, c.logo_url
      HAVING openings > 0
      ORDER BY openings DESC
    `);

    res.json({ success: true, data: companies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get upcoming placement drives
router.get('/drives/upcoming', async (req, res) => {
  try {
    const [drives] = await db.query(`
      SELECT 
        j.id,
        c.name as company,
        j.deadline as date,
        j.location as type,
        j.positions,
        j.title,
        CONCAT(j.package_min, '-', j.package_max, ' LPA') as package,
        j.status
      FROM jobs j
      JOIN companies c ON j.company_id = c.id
      WHERE j.status = 'active' 
        AND j.deadline >= CURDATE()
      ORDER BY j.deadline ASC
      LIMIT 10
    `);

    res.json({ success: true, data: drives });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get branch-wise placement statistics
router.get('/placements/branch-wise', async (req, res) => {
  try {
    const [stats] = await db.query(`
      SELECT 
        s.department as branch,
        COUNT(DISTINCT s.id) as total,
        COUNT(DISTINCT CASE WHEN a.status = 'selected' THEN s.id END) as placed,
        ROUND((COUNT(DISTINCT CASE WHEN a.status = 'selected' THEN s.id END) / COUNT(DISTINCT s.id)) * 100, 0) as percentage,
        ROUND(AVG(s.cgpa), 2) as avg_cgpa
      FROM students s
      LEFT JOIN applications a ON s.id = a.student_id
      GROUP BY s.department
      ORDER BY percentage DESC
    `);

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get recent applications activity
router.get('/applications/recent', async (req, res) => {
  try {
    const limit = req.query.limit || 20;
    const [applications] = await db.query(`
      SELECT 
        a.id,
        s.full_name as student_name,
        s.department,
        c.name as company_name,
        j.title as job_title,
        a.status,
        a.applied_date,
        a.updated_at
      FROM applications a
      JOIN students s ON a.student_id = s.id
      JOIN jobs j ON a.job_id = j.id
      JOIN companies c ON j.company_id = c.id
      ORDER BY a.applied_date DESC
      LIMIT ?
    `, [parseInt(limit)]);

    res.json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get top performing students
router.get('/students/top', async (req, res) => {
  try {
    const [students] = await db.query(`
      SELECT 
        s.id,
        s.full_name,
        s.department,
        s.cgpa,
        COUNT(DISTINCT a.id) as applications,
        COUNT(DISTINCT CASE WHEN a.status = 'selected' THEN a.id END) as offers,
        MAX(CASE WHEN a.status = 'selected' THEN 'Placed' ELSE 'Eligible' END) as status
      FROM students s
      LEFT JOIN applications a ON s.id = a.student_id
      GROUP BY s.id, s.full_name, s.department, s.cgpa
      ORDER BY s.cgpa DESC
      LIMIT 10
    `);

    res.json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get company-wise hiring stats
router.get('/companies/hiring-stats', async (req, res) => {
  try {
    const [companies] = await db.query(`
      SELECT 
        c.id,
        c.name,
        c.industry,
        COUNT(DISTINCT j.id) as total_jobs,
        COUNT(DISTINCT a.id) as total_applications,
        COUNT(DISTINCT CASE WHEN a.status = 'selected' THEN a.student_id END) as students_hired,
        ROUND(AVG((j.package_min + j.package_max) / 2), 1) as avg_package
      FROM companies c
      LEFT JOIN jobs j ON c.id = j.company_id
      LEFT JOIN applications a ON j.id = a.job_id
      GROUP BY c.id, c.name, c.industry
      HAVING total_jobs > 0
      ORDER BY students_hired DESC
    `);

    res.json({ success: true, data: companies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get monthly placement trends
router.get('/placements/trends', async (req, res) => {
  try {
    const [trends] = await db.query(`
      SELECT 
        DATE_FORMAT(a.updated_at, '%Y-%m') as month,
        COUNT(DISTINCT CASE WHEN a.status = 'selected' THEN a.student_id END) as placements,
        COUNT(DISTINCT a.student_id) as total_applicants,
        ROUND((COUNT(DISTINCT CASE WHEN a.status = 'selected' THEN a.student_id END) / COUNT(DISTINCT a.student_id)) * 100, 1) as success_rate
      FROM applications a
      WHERE a.updated_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
      GROUP BY month
      ORDER BY month DESC
    `);

    res.json({ success: true, data: trends });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get application status breakdown
router.get('/applications/status-breakdown', async (req, res) => {
  try {
    const [breakdown] = await db.query(`
      SELECT 
        a.status,
        COUNT(*) as count,
        ROUND((COUNT(*) / (SELECT COUNT(*) FROM applications)) * 100, 1) as percentage
      FROM applications a
      GROUP BY a.status
      ORDER BY count DESC
    `);

    res.json({ success: true, data: breakdown });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
