const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all students
router.get('/', async (req, res) => {
  try {
    const [students] = await db.query(`
      SELECT 
        s.*,
        COUNT(DISTINCT a.id) as application_count,
        COUNT(DISTINCT sk.id) as skills_count
      FROM students s
      LEFT JOIN applications a ON s.id = a.student_id
      LEFT JOIN student_skills sk ON s.id = sk.student_id
      GROUP BY s.id
    `);
    res.json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get student by ID
router.get('/:id', async (req, res) => {
  try {
    const [students] = await db.query('SELECT * FROM students WHERE id = ?', [req.params.id]);
    
    if (students.length === 0) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Get student skills
    const [skills] = await db.query('SELECT * FROM student_skills WHERE student_id = ?', [req.params.id]);
    
    // Get student certifications
    const [certifications] = await db.query('SELECT * FROM certifications WHERE student_id = ?', [req.params.id]);
    
    // Get student internships
    const [internships] = await db.query('SELECT * FROM internships WHERE student_id = ?', [req.params.id]);

    const student = {
      ...students[0],
      skills,
      certifications,
      internships
    };

    res.json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create new student
router.post('/', async (req, res) => {
  try {
    const { full_name, email, phone, roll_number, department, year, cgpa, date_of_birth, gender, address } = req.body;
    
    const [result] = await db.query(
      `INSERT INTO students (full_name, email, phone, roll_number, department, year, cgpa, date_of_birth, gender, address) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [full_name, email, phone, roll_number, department, year, cgpa, date_of_birth, gender, address]
    );

    res.status(201).json({ 
      success: true, 
      message: 'Student created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update student
router.put('/:id', async (req, res) => {
  try {
    const { full_name, email, phone, department, year, cgpa, date_of_birth, gender, address } = req.body;
    
    const [result] = await db.query(
      `UPDATE students SET full_name = ?, email = ?, phone = ?, department = ?, year = ?, 
       cgpa = ?, date_of_birth = ?, gender = ?, address = ? WHERE id = ?`,
      [full_name, email, phone, department, year, cgpa, date_of_birth, gender, address, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.json({ success: true, message: 'Student updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete student
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM students WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add student skill
router.post('/:id/skills', async (req, res) => {
  try {
    const { skill_name, proficiency_level, years_experience, category } = req.body;
    
    const [result] = await db.query(
      `INSERT INTO student_skills (student_id, skill_name, proficiency_level, years_experience, category) 
       VALUES (?, ?, ?, ?, ?)`,
      [req.params.id, skill_name, proficiency_level, years_experience, category]
    );

    res.status(201).json({ 
      success: true, 
      message: 'Skill added successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete student skill
router.delete('/:id/skills/:skillId', async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM student_skills WHERE id = ? AND student_id = ?',
      [req.params.skillId, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }

    res.json({ success: true, message: 'Skill deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add certification
router.post('/:id/certifications', async (req, res) => {
  try {
    const { name, issuer, date_obtained, expiry_date, credential_id } = req.body;
    
    const [result] = await db.query(
      `INSERT INTO certifications (student_id, name, issuer, date_obtained, expiry_date, credential_id) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [req.params.id, name, issuer, date_obtained, expiry_date, credential_id]
    );

    res.status(201).json({ 
      success: true, 
      message: 'Certification added successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete certification
router.delete('/:id/certifications/:certId', async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM certifications WHERE id = ? AND student_id = ?',
      [req.params.certId, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Certification not found' });
    }

    res.json({ success: true, message: 'Certification deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update certification
router.put('/:id/certifications/:certId', async (req, res) => {
  try {
    const { name, issuer, date_obtained, expiry_date, credential_id } = req.body;
    
    const [result] = await db.query(
      `UPDATE certifications SET name = ?, issuer = ?, date_obtained = ?, expiry_date = ?, credential_id = ? 
       WHERE id = ? AND student_id = ?`,
      [name, issuer, date_obtained, expiry_date, credential_id, req.params.certId, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Certification not found' });
    }

    res.json({ success: true, message: 'Certification updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add internship
router.post('/:id/internships', async (req, res) => {
  try {
    const { company, role, start_date, end_date, description, skills, is_current } = req.body;
    
    const [result] = await db.query(
      `INSERT INTO internships (student_id, company, role, start_date, end_date, description, skills, is_current) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.params.id, company, role, start_date, end_date, description, JSON.stringify(skills), is_current]
    );

    res.status(201).json({ 
      success: true, 
      message: 'Internship added successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete internship
router.delete('/:id/internships/:internshipId', async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM internships WHERE id = ? AND student_id = ?',
      [req.params.internshipId, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Internship not found' });
    }

    res.json({ success: true, message: 'Internship deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update internship
router.put('/:id/internships/:internshipId', async (req, res) => {
  try {
    const { company, role, start_date, end_date, description, skills, is_current } = req.body;
    
    const [result] = await db.query(
      `UPDATE internships SET company = ?, role = ?, start_date = ?, end_date = ?, description = ?, skills = ?, is_current = ? 
       WHERE id = ? AND student_id = ?`,
      [company, role, start_date, end_date, description, JSON.stringify(skills), is_current, req.params.internshipId, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Internship not found' });
    }

    res.json({ success: true, message: 'Internship updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
