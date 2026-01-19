-- ============================================
-- AUTHENTICATION SETUP FOR CLONED PROJECT
-- ============================================
-- Run these queries in MySQL after cloning the project

-- Step 1: Add password_hash column to students table
ALTER TABLE students 
ADD COLUMN password_hash VARCHAR(255) NULL AFTER email;

-- Step 2: Add index for better performance (optional but recommended)
CREATE INDEX idx_students_email ON students(email);

-- Step 3: Verify the column was added
SHOW COLUMNS FROM students;

-- ============================================
-- THAT'S IT! Now you can use the signup/login API
-- ============================================

-- Test account creation (do this via API, not SQL):
-- POST http://localhost:5000/api/auth/signup
-- Body: {
--   "email": "test@student.com",
--   "password": "password123",
--   "fullName": "Test Student",
--   "department": "Computer Science"
-- }

-- ============================================
-- OPTIONAL: Create sample test accounts
-- ============================================
-- Note: Use the Node.js script instead of manual SQL
-- Run: node backend/scripts/setupAuth.js
-- Or run: npm run setup-auth (if you add it to package.json)

-- ============================================
-- TROUBLESHOOTING
-- ============================================

-- Check if password_hash column exists:
SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'students' 
  AND COLUMN_NAME = 'password_hash'
  AND TABLE_SCHEMA = 'place';

-- Check users with password_hash:
SELECT id, email, full_name, 
       password_hash IS NOT NULL as has_password,
       LENGTH(password_hash) as hash_length
FROM students 
ORDER BY id DESC 
LIMIT 10;

-- ============================================
-- CLEANUP (if needed to start fresh)
-- ============================================

-- Remove all password hashes:
-- UPDATE students SET password_hash = NULL;

-- Drop the column completely:
-- ALTER TABLE students DROP COLUMN password_hash;
