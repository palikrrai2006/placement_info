const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all companies
router.get('/', async (req, res) => {
  try {
    const [companies] = await db.query(`
      SELECT 
        c.*,
        COUNT(DISTINCT j.id) as job_count
      FROM companies c
      LEFT JOIN jobs j ON c.id = j.company_id
      GROUP BY c.id
    `);
    res.json({ success: true, data: companies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get company by ID
router.get('/:id', async (req, res) => {
  try {
    const [companies] = await db.query('SELECT * FROM companies WHERE id = ?', [req.params.id]);
    
    if (companies.length === 0) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    // Get company jobs
    const [jobs] = await db.query('SELECT * FROM jobs WHERE company_id = ?', [req.params.id]);

    const company = {
      ...companies[0],
      jobs
    };

    res.json({ success: true, data: company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create new company
router.post('/', async (req, res) => {
  try {
    const { name, industry, location, description, website, logo_url, contact_email, contact_phone } = req.body;
    
    const [result] = await db.query(
      `INSERT INTO companies (name, industry, location, description, website, logo_url, contact_email, contact_phone) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, industry, location, description, website, logo_url, contact_email, contact_phone]
    );

    res.status(201).json({ 
      success: true, 
      message: 'Company created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update company
router.put('/:id', async (req, res) => {
  try {
    const { name, industry, location, description, website, logo_url, contact_email, contact_phone } = req.body;
    
    const [result] = await db.query(
      `UPDATE companies SET name = ?, industry = ?, location = ?, description = ?, website = ?, 
       logo_url = ?, contact_email = ?, contact_phone = ? WHERE id = ?`,
      [name, industry, location, description, website, logo_url, contact_email, contact_phone, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    res.json({ success: true, message: 'Company updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete company
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM companies WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    res.json({ success: true, message: 'Company deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
