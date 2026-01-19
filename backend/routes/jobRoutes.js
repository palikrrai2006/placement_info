const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all jobs
router.get('/', async (req, res) => {
  try {
    const { company_id, type, location, status } = req.query;
    let query = `
      SELECT 
        j.*,
        c.name as company_name,
        c.logo_url as company_logo,
        COUNT(DISTINCT a.id) as application_count
      FROM jobs j
      LEFT JOIN companies c ON j.company_id = c.id
      LEFT JOIN applications a ON j.id = a.job_id
    `;
    
    const conditions = [];
    const params = [];

    if (company_id) {
      conditions.push('j.company_id = ?');
      params.push(company_id);
    }
    if (type) {
      conditions.push('j.job_type = ?');
      params.push(type);
    }
    if (location) {
      conditions.push('j.location LIKE ?');
      params.push(`%${location}%`);
    }
    if (status) {
      conditions.push('j.status = ?');
      params.push(status);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' GROUP BY j.id ORDER BY j.created_at DESC';

    const [jobs] = await db.query(query, params);
    res.json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get job by ID
router.get('/:id', async (req, res) => {
  try {
    const [jobs] = await db.query(`
      SELECT 
        j.*,
        c.name as company_name,
        c.logo_url as company_logo,
        c.description as company_description,
        c.website as company_website
      FROM jobs j
      LEFT JOIN companies c ON j.company_id = c.id
      WHERE j.id = ?
    `, [req.params.id]);
    
    if (jobs.length === 0) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.json({ success: true, data: jobs[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create new job
router.post('/', async (req, res) => {
  try {
    const { 
      company_id, title, description, required_skills, preferred_skills, 
      job_type, location, package_min, package_max, eligibility_criteria, 
      deadline, positions 
    } = req.body;
    
    const [result] = await db.query(
      `INSERT INTO jobs (
        company_id, title, description, required_skills, preferred_skills,
        job_type, location, package_min, package_max, eligibility_criteria,
        deadline, positions
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        company_id, title, description, 
        JSON.stringify(required_skills), 
        JSON.stringify(preferred_skills),
        job_type, location, package_min, package_max, 
        JSON.stringify(eligibility_criteria),
        deadline, positions
      ]
    );

    res.status(201).json({ 
      success: true, 
      message: 'Job created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update job
router.put('/:id', async (req, res) => {
  try {
    const { 
      title, description, required_skills, preferred_skills, 
      job_type, location, package_min, package_max, eligibility_criteria, 
      deadline, positions, status 
    } = req.body;
    
    const [result] = await db.query(
      `UPDATE jobs SET 
        title = ?, description = ?, required_skills = ?, preferred_skills = ?,
        job_type = ?, location = ?, package_min = ?, package_max = ?,
        eligibility_criteria = ?, deadline = ?, positions = ?, status = ?
      WHERE id = ?`,
      [
        title, description, 
        JSON.stringify(required_skills), 
        JSON.stringify(preferred_skills),
        job_type, location, package_min, package_max,
        JSON.stringify(eligibility_criteria),
        deadline, positions, status,
        req.params.id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.json({ success: true, message: 'Job updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete job
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM jobs WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
