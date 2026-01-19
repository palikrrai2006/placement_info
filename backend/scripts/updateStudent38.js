require('dotenv').config();
const db = require('../config/database');
const bcrypt = require('bcrypt');

async function generateUpdateQueries() {
  try {
    // First, check if student exists
    const [students] = await db.query('SELECT * FROM students WHERE id = 38');
    
    if (students.length === 0) {
      console.log('❌ Student with id 38 does not exist');
      console.log('\n📝 To INSERT a new student with id 38:\n');
      console.log(`INSERT INTO students (id, email, password_hash, full_name, roll_number, department, year, cgpa, phone, date_of_birth)
VALUES (38, 'student38@university.edu', NULL, 'Student Name', 'ROLL038', 'Computer Science', 3, 8.5, '9876543210', '2003-01-15');`);
      
      console.log('\n📝 To set password for this student (use signup API or run this SQL after insert):\n');
      const hashedPassword = await bcrypt.hash('password123', 10);
      console.log(`UPDATE students SET password_hash = '${hashedPassword}' WHERE id = 38;`);
      
    } else {
      console.log('✅ Student found with id 38:');
      console.log(students[0]);
      
      console.log('\n📝 SQL UPDATE QUERIES FOR STUDENT ID 38:\n');
      
      // Update basic info
      console.log('-- Update basic information:');
      console.log(`UPDATE students 
SET full_name = 'Updated Full Name',
    roll_number = 'ROLL038',
    department = 'Computer Science',
    year = 3,
    cgpa = 8.5,
    phone = '9876543210',
    date_of_birth = '2003-01-15'
WHERE id = 38;
`);

      // Update email
      console.log('-- Update email:');
      console.log(`UPDATE students SET email = 'newemail38@university.edu' WHERE id = 38;
`);

      // Update password
      console.log('-- Update password (sets password to "newpassword123"):');
      const newHashedPassword = await bcrypt.hash('newpassword123', 10);
      console.log(`UPDATE students SET password_hash = '${newHashedPassword}' WHERE id = 38;
`);

      // Update specific fields
      console.log('-- Update only CGPA:');
      console.log(`UPDATE students SET cgpa = 9.0 WHERE id = 38;
`);

      console.log('-- Update only year:');
      console.log(`UPDATE students SET year = 4 WHERE id = 38;
`);

      console.log('-- Update only department:');
      console.log(`UPDATE students SET department = 'Information Technology' WHERE id = 38;
`);

      // Delete student
      console.log('-- To DELETE student:');
      console.log(`DELETE FROM students WHERE id = 38;
`);
    }
    
    console.log('\n📌 USAGE NOTES:');
    console.log('1. Replace placeholder values with actual data');
    console.log('2. For password updates, ALWAYS use bcrypt hash (never plain text)');
    console.log('3. Email must be unique across all students');
    console.log('4. Verify changes with: SELECT * FROM students WHERE id = 38;');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit();
  }
}

generateUpdateQueries();
