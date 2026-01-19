const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all applications
router.get('/', async (req, res) => {
  try {
    const { student_id, job_id, status } = req.query;
    let query = `
      SELECT 
        a.*,
        s.full_name as student_name,
        s.email as student_email,
        s.roll_number,
        s.cgpa,
        j.title as job_title,
        c.name as company_name
      FROM applications a
      LEFT JOIN students s ON a.student_id = s.id
      LEFT JOIN jobs j ON a.job_id = j.id
      LEFT JOIN companies c ON j.company_id = c.id
    `;
    
    const conditions = [];
    const params = [];

    if (student_id) {
      conditions.push('a.student_id = ?');
      params.push(student_id);
    }
    if (job_id) {
      conditions.push('a.job_id = ?');
      params.push(job_id);
    }
    if (status) {
      conditions.push('a.status = ?');
      params.push(status);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY a.applied_date DESC';

    const [applications] = await db.query(query, params);
    res.json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get application by ID
router.get('/:id', async (req, res) => {
  try {
    const [applications] = await db.query(`
      SELECT 
        a.*,
        s.full_name as student_name,
        s.email as student_email,
        s.phone as student_phone,
        s.roll_number,
        s.department,
        s.cgpa,
        j.title as job_title,
        j.description as job_description,
        c.name as company_name,
        c.logo_url as company_logo
      FROM applications a
      LEFT JOIN students s ON a.student_id = s.id
      LEFT JOIN jobs j ON a.job_id = j.id
      LEFT JOIN companies c ON j.company_id = c.id
      WHERE a.id = ?
    `, [req.params.id]);
    
    if (applications.length === 0) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    res.json({ success: true, data: applications[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create new application
router.post('/', async (req, res) => {
  try {
    const { student_id, job_id, cover_letter } = req.body;
    
    // Check if already applied
    const [existing] = await db.query(
      'SELECT id FROM applications WHERE student_id = ? AND job_id = ?',
      [student_id, job_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Already applied to this job' });
    }

    const [result] = await db.query(
      `INSERT INTO applications (student_id, job_id, cover_letter, status) 
       VALUES (?, ?, ?, 'applied')`,
      [student_id, job_id, cover_letter]
    );

    res.status(201).json({ 
      success: true, 
      message: 'Application submitted successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update application status
router.put('/:id', async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    // Build dynamic query based on provided fields
    const updates = [];
    const values = [];
    
    if (status !== undefined) {
      updates.push('status = ?');
      values.push(status);
    }
    
    if (notes !== undefined) {
      updates.push('notes = ?');
      values.push(notes);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }
    
    values.push(req.params.id);
    
    const [result] = await db.query(
      `UPDATE applications SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    res.json({ success: true, message: 'Application updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete application
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM applications WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    res.json({ success: true, message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
