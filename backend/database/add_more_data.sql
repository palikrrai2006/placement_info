-- ============================================
-- ADD MORE SAMPLE DATA (Without Dropping Tables)
-- ============================================
-- This file only adds INSERT statements to existing tables
-- Safe to run on existing database with data
-- Run with: mysql -u root -p place < backend/database/add_more_data.sql

USE place;

-- ============================================
-- INSERT MORE STUDENTS (IDs will auto-increment from current max)
-- ============================================

INSERT INTO students (full_name, email, phone, roll_number, department, year, cgpa, date_of_birth, gender, address) VALUES
-- More Computer Science students
('Aarav Sharma', 'aarav.sharma@university.edu', '+91 9876543201', 'CS2021-101', 'Computer Science', '4th Year', 8.5, '2003-01-15', 'Male', 'Hostel A-101'),
('Ishita Patel', 'ishita.patel@university.edu', '+91 9876543202', 'CS2021-102', 'Computer Science', '4th Year', 9.0, '2003-02-20', 'Female', 'Girls Hostel B-201'),
('Rohan Kumar', 'rohan.kumar@university.edu', '+91 9876543203', 'CS2021-103', 'Computer Science', '4th Year', 8.8, '2003-03-10', 'Male', 'Hostel C-302'),
('Ananya Singh', 'ananya.singh@university.edu', '+91 9876543204', 'CS2021-104', 'Computer Science', '4th Year', 9.2, '2003-04-05', 'Female', 'Girls Hostel D-102'),
('Arjun Reddy', 'arjun.reddy@university.edu', '+91 9876543205', 'CS2021-105', 'Computer Science', '4th Year', 8.3, '2003-05-18', 'Male', 'Hostel E-205'),

-- More Information Technology students
('Aditya Kapoor', 'aditya.kapoor@university.edu', '+91 9876543211', 'IT2021-101', 'Information Technology', '4th Year', 8.4, '2003-01-25', 'Male', 'Hostel K-501'),
('Neha Iyer', 'neha.iyer@university.edu', '+91 9876543212', 'IT2021-102', 'Information Technology', '4th Year', 8.7, '2003-02-16', 'Female', 'Girls Hostel L-107'),
('Rahul Malhotra', 'rahul.malhotra@university.edu', '+91 9876543213', 'IT2021-103', 'Information Technology', '4th Year', 7.9, '2003-03-30', 'Male', 'Hostel M-202'),
('Kavya Desai', 'kavya.desai@university.edu', '+91 9876543214', 'IT2021-104', 'Information Technology', '4th Year', 8.9, '2003-04-19', 'Female', 'Girls Hostel N-308'),
('Siddharth Roy', 'siddharth.roy@university.edu', '+91 9876543215', 'IT2021-105', 'Information Technology', '4th Year', 8.2, '2003-05-08', 'Male', 'Hostel O-403'),

-- More Electronics students
('Vikram Singh', 'vikram.singh@university.edu', '+91 9876543221', 'ECE2021-101', 'Electronics', '4th Year', 8.3, '2003-11-14', 'Male', 'Hostel U-302'),
('Anjali Chopra', 'anjali.chopra@university.edu', '+91 9876543222', 'ECE2021-102', 'Electronics', '4th Year', 8.6, '2003-12-02', 'Female', 'Girls Hostel V-105'),
('Amit Bose', 'amit.bose@university.edu', '+91 9876543223', 'ECE2021-103', 'Electronics', '4th Year', 7.8, '2003-01-20', 'Male', 'Hostel W-203'),

-- More Mechanical students
('Pooja Kulkarni', 'pooja.kulkarni@university.edu', '+91 9876543226', 'MECH2021-101', 'Mechanical', '4th Year', 7.5, '2003-04-26', 'Female', 'Girls Hostel Z-108'),
('Kartik Rao', 'kartik.rao@university.edu', '+91 9876543227', 'MECH2021-102', 'Mechanical', '4th Year', 8.0, '2003-05-13', 'Male', 'Hostel AA-501');


-- ============================================
-- INSERT MORE COMPANIES
-- ============================================

INSERT INTO companies (name, industry, location, description, website, contact_email, contact_phone) VALUES
('Google', 'Technology', 'Bangalore', 'Global technology leader', 'https://google.com', 'careers@google.com', '+91 80 12345678'),
('Microsoft', 'Technology', 'Hyderabad', 'Software and cloud services', 'https://microsoft.com', 'jobs@microsoft.com', '+91 40 23456789'),
('Amazon', 'E-commerce', 'Bangalore', 'E-commerce and cloud computing', 'https://amazon.com', 'hiring@amazon.com', '+91 80 34567890'),
('Adobe', 'Software', 'Bangalore', 'Creative software solutions', 'https://adobe.com', 'jobs@adobe.com', '+91 80 34567890'),
('Salesforce', 'SaaS', 'Bangalore', 'CRM solutions', 'https://salesforce.com', 'careers@salesforce.com', '+91 80 89012345'),
('Intel', 'Hardware', 'Bangalore', 'Semiconductor company', 'https://intel.com', 'recruitment@intel.com', '+91 80 90123456'),
('Qualcomm', 'Hardware', 'Bangalore', 'Wireless technology', 'https://qualcomm.com', 'jobs@qualcomm.com', '+91 80 01234567'),
('Flipkart', 'E-commerce', 'Bangalore', 'E-commerce platform', 'https://flipkart.com', 'careers@flipkart.com', '+91 80 89012345'),
('Paytm', 'FinTech', 'Noida', 'Digital payments', 'https://paytm.com', 'hr@paytm.com', '+91 120 90123456');


-- ============================================
-- Note: To add skills, jobs, and applications, you need to use the actual student IDs
-- from your database. Get the new student IDs first, then add their skills and applications.
-- 
-- To find new student IDs, run:
-- SELECT id, full_name, email FROM students ORDER BY id DESC LIMIT 20;
-- 
-- Then update the queries below with actual IDs
-- ============================================

-- Get last student ID to add skills
SET @last_student_id = (SELECT MAX(id) FROM students);

-- Add skills for recently added students (adjust student_id based on your database)
-- Example: If last student ID is 50, then new students are 51-65

-- Skills for new CS students (use actual IDs from your database)
-- INSERT INTO student_skills (student_id, skill_name, proficiency_level, years_experience, category) VALUES
-- (@last_student_id - 14, 'Python', 'Advanced', 2.5, 'Programming'),
-- (@last_student_id - 14, 'Java', 'Intermediate', 1.5, 'Programming'),
-- Add more skills as needed...


-- ============================================
-- VERIFICATION QUERIES
-- ============================================

SELECT '=== CURRENT DATABASE STATUS ===' as '';

SELECT 
  'Students' as entity,
  COUNT(*) as total_count,
  COUNT(CASE WHEN gender = 'Male' THEN 1 END) as male,
  COUNT(CASE WHEN gender = 'Female' THEN 1 END) as female,
  ROUND(AVG(cgpa), 2) as avg_cgpa
FROM students;

SELECT 
  department,
  COUNT(*) as student_count,
  ROUND(AVG(cgpa), 2) as avg_cgpa
FROM students
GROUP BY department
ORDER BY student_count DESC;

SELECT 
  'Companies' as entity,
  COUNT(*) as total_companies
FROM companies;

SELECT 
  'Jobs' as entity,
  COUNT(*) as total_jobs,
  COUNT(CASE WHEN status = 'active' THEN 1 END) as active_jobs
FROM jobs;

SELECT 
  'Applications' as entity,
  COUNT(*) as total_applications,
  COUNT(CASE WHEN status = 'selected' THEN 1 END) as placements
FROM applications;

SELECT '=== DATA ADDITION COMPLETE ===' as '';
