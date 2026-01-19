-- Populate Database with Sample Data for Analytics
-- Run this after schema.sql

-- Clear existing data (optional - comment out if you want to keep existing data)
-- DELETE FROM applications;
-- DELETE FROM jobs;
-- DELETE FROM companies;
-- DELETE FROM internships;
-- DELETE FROM certifications;
-- DELETE FROM student_skills;
-- DELETE FROM students WHERE id > 3;

-- Add more students for better analytics
INSERT INTO students (full_name, email, phone, roll_number, department, year, cgpa, date_of_birth, gender, address) VALUES
('Rahul Kumar', 'rahul.kumar@university.edu', '+91 9876543213', 'CS2021-003', 'Computer Science', '4th Year', 8.7, '2003-04-12', 'Male', '12 Tech Park'),
('Priya Sharma', 'priya.sharma@university.edu', '+91 9876543214', 'CS2021-004', 'Computer Science', '4th Year', 9.2, '2003-06-08', 'Female', '34 Innovation Street'),
('Amit Patel', 'amit.patel@university.edu', '+91 9876543215', 'IT2021-002', 'Information Technology', '4th Year', 7.8, '2003-09-15', 'Male', '56 Campus Lane'),
('Sneha Reddy', 'sneha.reddy@university.edu', '+91 9876543216', 'IT2021-003', 'Information Technology', '4th Year', 8.9, '2003-02-20', 'Female', '78 College Road'),
('Vikram Singh', 'vikram.singh@university.edu', '+91 9876543217', 'ECE2021-001', 'Electronics', '4th Year', 8.3, '2003-11-25', 'Male', '90 University Ave'),
('Anjali Gupta', 'anjali.gupta@university.edu', '+91 9876543218', 'ECE2021-002', 'Electronics', '4th Year', 8.6, '2003-01-30', 'Female', '11 Engineering Block'),
('Karthik Rao', 'karthik.rao@university.edu', '+91 9876543219', 'MECH2021-001', 'Mechanical', '4th Year', 7.5, '2003-08-14', 'Male', '22 Hostel Wing'),
('Divya Nair', 'divya.nair@university.edu', '+91 9876543220', 'CS2021-005', 'Computer Science', '4th Year', 9.1, '2003-03-18', 'Female', '33 Student Quarter'),
('Arjun Mehta', 'arjun.mehta@university.edu', '+91 9876543221', 'IT2021-004', 'Information Technology', '4th Year', 8.4, '2003-07-22', 'Male', '44 PG Block'),
('Pooja Iyer', 'pooja.iyer@university.edu', '+91 9876543222', 'CS2021-006', 'Computer Science', '4th Year', 8.8, '2003-05-09', 'Female', '55 Girls Hostel'),
('Rohan Das', 'rohan.das@university.edu', '+91 9876543223', 'ECE2021-003', 'Electronics', '4th Year', 7.9, '2003-10-16', 'Male', '66 Boys Hostel'),
('Meera Joshi', 'meera.joshi@university.edu', '+91 9876543224', 'IT2021-005', 'Information Technology', '4th Year', 9.0, '2003-12-05', 'Female', '77 Campus View');

-- Add comprehensive student skills
INSERT INTO student_skills (student_id, skill_name, proficiency_level, years_experience, category) VALUES
-- Student 4 (Rahul Kumar)
(4, 'JavaScript', 'Advanced', 2.5, 'Programming'),
(4, 'React', 'Advanced', 2.0, 'Framework'),
(4, 'Node.js', 'Advanced', 1.5, 'Backend'),
(4, 'MongoDB', 'Intermediate', 1.0, 'Database'),
(4, 'Docker', 'Intermediate', 1.0, 'DevOps'),
-- Student 5 (Priya Sharma)
(5, 'Python', 'Expert', 3.0, 'Programming'),
(5, 'Machine Learning', 'Advanced', 2.5, 'AI/ML'),
(5, 'Deep Learning', 'Advanced', 2.0, 'AI/ML'),
(5, 'TensorFlow', 'Advanced', 2.0, 'Framework'),
(5, 'PyTorch', 'Advanced', 1.5, 'Framework'),
(5, 'Data Science', 'Advanced', 2.0, 'Analytics'),
-- Student 6 (Amit Patel)
(6, 'Java', 'Advanced', 2.0, 'Programming'),
(6, 'Spring Boot', 'Intermediate', 1.5, 'Framework'),
(6, 'MySQL', 'Intermediate', 1.5, 'Database'),
(6, 'AWS', 'Beginner', 0.5, 'Cloud'),
-- Student 7 (Sneha Reddy)
(7, 'JavaScript', 'Advanced', 2.0, 'Programming'),
(7, 'React', 'Advanced', 2.0, 'Framework'),
(7, 'Angular', 'Intermediate', 1.0, 'Framework'),
(7, 'CSS', 'Advanced', 2.5, 'Frontend'),
(7, 'HTML', 'Expert', 3.0, 'Frontend'),
-- Student 8 (Vikram Singh)
(8, 'Python', 'Advanced', 2.0, 'Programming'),
(8, 'C++', 'Advanced', 2.5, 'Programming'),
(8, 'Embedded Systems', 'Intermediate', 1.5, 'Hardware'),
(8, 'IoT', 'Intermediate', 1.0, 'Hardware'),
-- Student 9 (Anjali Gupta)
(9, 'Python', 'Advanced', 2.0, 'Programming'),
(9, 'MATLAB', 'Advanced', 2.0, 'Tools'),
(9, 'Signal Processing', 'Intermediate', 1.5, 'Domain'),
-- Student 10 (Karthik Rao)
(10, 'CAD', 'Advanced', 2.5, 'Tools'),
(10, 'SolidWorks', 'Advanced', 2.0, 'Tools'),
(10, 'Python', 'Intermediate', 1.0, 'Programming'),
-- Student 11 (Divya Nair)
(11, 'Python', 'Expert', 3.0, 'Programming'),
(11, 'Java', 'Advanced', 2.0, 'Programming'),
(11, 'React', 'Advanced', 2.0, 'Framework'),
(11, 'Node.js', 'Advanced', 1.5, 'Backend'),
(11, 'AWS', 'Intermediate', 1.5, 'Cloud'),
(11, 'Kubernetes', 'Beginner', 0.5, 'DevOps'),
-- Student 12 (Arjun Mehta)
(12, 'Java', 'Advanced', 2.5, 'Programming'),
(12, 'Spring Boot', 'Advanced', 2.0, 'Framework'),
(12, 'Microservices', 'Intermediate', 1.5, 'Architecture'),
(12, 'Docker', 'Intermediate', 1.0, 'DevOps'),
-- Student 13 (Pooja Iyer)
(13, 'JavaScript', 'Advanced', 2.0, 'Programming'),
(13, 'React', 'Expert', 2.5, 'Framework'),
(13, 'TypeScript', 'Advanced', 1.5, 'Programming'),
(13, 'Redux', 'Advanced', 1.5, 'State Management'),
-- Student 14 (Rohan Das)
(14, 'Python', 'Intermediate', 1.5, 'Programming'),
(14, 'C', 'Advanced', 2.0, 'Programming'),
(14, 'Embedded C', 'Advanced', 1.5, 'Programming'),
-- Student 15 (Meera Joshi)
(15, 'JavaScript', 'Advanced', 2.0, 'Programming'),
(15, 'React', 'Advanced', 2.0, 'Framework'),
(15, 'Node.js', 'Advanced', 1.5, 'Backend'),
(15, 'MongoDB', 'Advanced', 1.5, 'Database'),
(15, 'GraphQL', 'Intermediate', 1.0, 'API');

-- Add more companies
INSERT INTO companies (name, industry, location, description, website, contact_email, contact_phone) VALUES
('Amazon', 'E-commerce & Cloud', 'Bangalore', 'Global e-commerce and cloud computing leader', 'https://amazon.com', 'hiring@amazon.com', '+91 80 11111111'),
('Microsoft', 'Technology', 'Hyderabad', 'Global technology company', 'https://microsoft.com', 'careers@microsoft.com', '+91 40 22222222'),
('Google', 'Technology', 'Bangalore', 'Search engine and technology giant', 'https://google.com', 'jobs@google.com', '+91 80 33333333'),
('Infosys', 'IT Services', 'Pune', 'IT services and consulting', 'https://infosys.com', 'recruitment@infosys.com', '+91 20 44444444'),
('TCS', 'IT Services', 'Mumbai', 'IT services, consulting and solutions', 'https://tcs.com', 'careers@tcs.com', '+91 22 55555555'),
('Wipro', 'IT Services', 'Bangalore', 'Global IT services company', 'https://wipro.com', 'jobs@wipro.com', '+91 80 66666666'),
('Accenture', 'Consulting', 'Bangalore', 'Global professional services company', 'https://accenture.com', 'hiring@accenture.com', '+91 80 77777777'),
('Cognizant', 'IT Services', 'Chennai', 'IT services and consulting', 'https://cognizant.com', 'careers@cognizant.com', '+91 44 88888888');

-- Add more jobs with diverse packages
INSERT INTO jobs (company_id, title, description, required_skills, preferred_skills, job_type, location, package_min, package_max, eligibility_criteria, deadline, positions, status) VALUES
-- Amazon jobs
(4, 'SDE-1', 'Software Development Engineer role', '["Java", "Python", "Data Structures", "Algorithms"]', '["AWS", "Distributed Systems"]', 'Full-time', 'Bangalore', 18.0, 22.0, '{"min_cgpa": 7.5}', '2025-12-31', 8, 'active'),
(4, 'Frontend Developer', 'Build customer-facing applications', '["JavaScript", "React", "HTML", "CSS"]', '["Redux", "TypeScript"]', 'Full-time', 'Bangalore', 15.0, 18.0, '{"min_cgpa": 7.0}', '2025-12-31', 5, 'active'),
-- Microsoft jobs
(5, 'Software Engineer', 'Develop cloud solutions', '["C#", "Azure", "SQL"]', '["Kubernetes", "Docker"]', 'Full-time', 'Hyderabad', 20.0, 25.0, '{"min_cgpa": 8.0}', '2025-12-31', 6, 'active'),
(5, 'Data Engineer', 'Build data pipelines', '["Python", "SQL", "Azure"]', '["Spark", "Hadoop"]', 'Full-time', 'Hyderabad', 16.0, 20.0, '{"min_cgpa": 7.5}', '2025-12-31', 4, 'active'),
-- Google jobs
(6, 'Software Engineer', 'Work on cutting-edge technology', '["Java", "Python", "Algorithms"]', '["Machine Learning", "Go"]', 'Full-time', 'Bangalore', 25.0, 30.0, '{"min_cgpa": 8.5}', '2025-12-31', 4, 'active'),
(6, 'ML Engineer', 'Build ML models at scale', '["Python", "Machine Learning", "TensorFlow"]', '["PyTorch", "Distributed Systems"]', 'Full-time', 'Bangalore', 28.0, 35.0, '{"min_cgpa": 8.5}', '2025-12-31', 3, 'active'),
-- Infosys jobs
(7, 'Systems Engineer', 'Join as Systems Engineer', '["Java", "SQL"]', '["Spring Boot"]', 'Full-time', 'Pune', 3.5, 4.5, '{"min_cgpa": 6.0}', '2025-12-31', 50, 'active'),
(7, 'Digital Specialist Engineer', 'Work on digital transformation', '["JavaScript", "React", "Node.js"]', '["Cloud", "DevOps"]', 'Full-time', 'Pune', 6.0, 8.0, '{"min_cgpa": 7.0}', '2025-12-31', 20, 'active'),
-- TCS jobs
(8, 'Assistant Systems Engineer', 'Entry level engineering role', '["Java", "Python"]', '["Spring"]', 'Full-time', 'Mumbai', 3.2, 4.0, '{"min_cgpa": 6.0}', '2025-12-31', 100, 'active'),
(9, 'Senior Software Engineer', 'Experienced developer role', '["Java", "Spring Boot", "Microservices"]', '["AWS", "Docker"]', 'Full-time', 'Bangalore', 12.0, 15.0, '{"min_cgpa": 7.5}', '2025-12-31', 10, 'active'),
-- Accenture jobs
(10, 'Technology Analyst', 'Consulting and technology role', '["Java", "SQL", "Problem Solving"]', '["Cloud", "Agile"]', 'Full-time', 'Bangalore', 4.5, 6.0, '{"min_cgpa": 6.5}', '2025-12-31', 30, 'active'),
(10, 'Advanced App Engineering Analyst', 'Full-stack development', '["JavaScript", "React", "Node.js", "MongoDB"]', '["AWS", "Docker"]', 'Full-time', 'Bangalore', 8.0, 10.0, '{"min_cgpa": 7.0}', '2025-12-31', 15, 'active'),
-- Cognizant jobs
(11, 'Programmer Analyst', 'Software development role', '["Java", "SQL"]', '["Spring", "REST API"]', 'Full-time', 'Chennai', 4.0, 5.0, '{"min_cgpa": 6.5}', '2025-12-31', 40, 'active');

-- Add applications with various statuses
INSERT INTO applications (student_id, job_id, status, cover_letter) VALUES
-- Selected applications (placed students)
(1, 5, 'selected', 'Excited to join Software Engineer role'),
(2, 10, 'selected', 'Looking forward to ML Engineer position'),
(4, 7, 'selected', 'Happy to accept SDE-1 offer'),
(5, 10, 'selected', 'Grateful for ML Engineer opportunity'),
(7, 8, 'selected', 'Accepting Frontend Developer role'),
(11, 9, 'selected', 'Excited for Software Engineer position at Microsoft'),
(13, 8, 'selected', 'Accepting Frontend Developer at Amazon'),
(15, 16, 'selected', 'Joining Advanced App Engineering role'),
-- Shortlisted
(3, 5, 'shortlisted', 'Interested in Software Engineer role'),
(6, 13, 'shortlisted', 'Applied for Systems Engineer'),
(9, 11, 'shortlisted', 'Interested in Data Engineer position'),
(12, 14, 'shortlisted', 'Applying for Senior Software Engineer'),
-- Interview scheduled
(4, 9, 'interview-scheduled', 'Preparing for Microsoft interview'),
(8, 13, 'interview-scheduled', 'Ready for Infosys interview'),
(10, 18, 'interview-scheduled', 'Looking forward to interview'),
-- Under review
(1, 11, 'under-review', 'Application under consideration'),
(3, 15, 'under-review', 'Waiting for response'),
(6, 7, 'under-review', 'Hope to hear back soon'),
(14, 13, 'under-review', 'Applied for Systems Engineer'),
-- Applied (just submitted)
(2, 7, 'applied', 'Recently applied for SDE role'),
(5, 9, 'applied', 'Submitted application for Microsoft'),
(7, 16, 'applied', 'Applied for consulting role'),
(9, 14, 'applied', 'Interested in TCS role'),
(10, 13, 'applied', 'Application for Infosys'),
(12, 8, 'applied', 'Applying for Frontend role'),
(13, 11, 'applied', 'Interested in Data Engineering'),
(15, 7, 'applied', 'Application for Amazon'),
-- Rejected
(3, 10, 'rejected', 'Application was not selected'),
(6, 9, 'rejected', 'Did not proceed further'),
(8, 7, 'rejected', 'Not selected for this round');

-- Add certifications
INSERT INTO certifications (student_id, name, issuer, date_obtained, credential_id) VALUES
(1, 'AWS Certified Developer', 'Amazon Web Services', '2024-06-15', 'AWS-2024-001'),
(2, 'TensorFlow Developer Certificate', 'Google', '2024-05-20', 'TF-2024-002'),
(4, 'Full Stack Web Development', 'Coursera', '2024-03-10', 'FSWD-2024-003'),
(5, 'Deep Learning Specialization', 'deeplearning.ai', '2024-07-01', 'DL-2024-004'),
(7, 'React Advanced Patterns', 'Udemy', '2024-04-15', 'REACT-2024-005'),
(11, 'Kubernetes Administrator', 'CNCF', '2024-08-20', 'CKA-2024-006'),
(13, 'TypeScript Fundamentals', 'Microsoft', '2024-02-28', 'TS-2024-007');

-- Add internships
INSERT INTO internships (student_id, company, role, start_date, end_date, description, is_current) VALUES
(1, 'Startup XYZ', 'Full Stack Intern', '2024-05-01', '2024-07-31', 'Developed web applications using MERN stack', FALSE),
(2, 'Research Lab', 'ML Research Intern', '2024-06-01', '2024-08-31', 'Worked on computer vision projects', FALSE),
(4, 'Tech Startup', 'Backend Developer Intern', '2024-04-01', '2024-06-30', 'Built REST APIs and microservices', FALSE),
(5, 'AI Company', 'Data Science Intern', '2024-05-15', '2024-08-15', 'Analyzed datasets and built ML models', FALSE),
(7, 'Design Agency', 'Frontend Intern', '2024-03-01', '2024-05-31', 'Created responsive user interfaces', FALSE),
(11, 'Cloud Services Inc', 'DevOps Intern', '2024-06-01', '2024-08-31', 'Managed CI/CD pipelines', FALSE);

-- Verification queries
SELECT 'Total Students:', COUNT(*) FROM students;
SELECT 'Total Skills:', COUNT(*) FROM student_skills;
SELECT 'Total Companies:', COUNT(*) FROM companies;
SELECT 'Total Jobs:', COUNT(*) FROM jobs;
SELECT 'Total Applications:', COUNT(*) FROM applications;
SELECT 'Placed Students:', COUNT(DISTINCT student_id) FROM applications WHERE status = 'selected';

-- Analytics preview queries
SELECT 'Department Stats:' as info;
SELECT 
  department,
  COUNT(*) as students,
  ROUND(AVG(cgpa), 2) as avg_cgpa
FROM students
GROUP BY department;

SELECT 'Top Skills:' as info;
SELECT 
  skill_name,
  COUNT(*) as student_count
FROM student_skills
GROUP BY skill_name
ORDER BY student_count DESC
LIMIT 5;

SELECT 'Application Status Distribution:' as info;
SELECT 
  status,
  COUNT(*) as count
FROM applications
GROUP BY status;
