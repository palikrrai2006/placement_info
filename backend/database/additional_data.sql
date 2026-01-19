-- Additional Sample Data for Placement Portal
-- Run this after schema.sql has been executed and initial data is loaded

-- Get current counts
SET @student_start_id = (SELECT COALESCE(MAX(id), 0) FROM students);
SET @company_start_id = (SELECT COALESCE(MAX(id), 0) FROM companies);

-- Add more students (will get auto-increment IDs starting after existing students)
INSERT INTO students (full_name, email, phone, roll_number, department, year, cgpa, date_of_birth, gender, address) VALUES
('Sarah Williams', 'sarah.williams@university.edu', '+91 9876543213', 'CS2021-003', 'Computer Science', '4th Year', 8.8, '2003-06-25', 'Female', '321 Campus Drive'),
('David Brown', 'david.brown@university.edu', '+91 9876543214', 'IT2021-002', 'Information Technology', '4th Year', 7.9, '2003-08-15', 'Male', '654 University Lane'),
('Emily Davis', 'emily.davis@university.edu', '+91 9876543215', 'CS2021-004', 'Computer Science', '4th Year', 9.2, '2003-04-30', 'Female', '987 College Road'),
('Robert Wilson', 'robert.wilson@university.edu', '+91 9876543216', 'IT2021-003', 'Information Technology', '4th Year', 8.1, '2003-09-12', 'Male', '147 Campus Street'),
('Lisa Anderson', 'lisa.anderson@university.edu', '+91 9876543217', 'CS2021-005', 'Computer Science', '4th Year', 8.6, '2003-02-18', 'Female', '258 University Circle'),
('James Taylor', 'james.taylor@university.edu', '+91 9876543218', 'ECE2021-001', 'Electronics', '4th Year', 7.8, '2003-11-05', 'Male', '369 College Avenue'),
('Maria Garcia', 'maria.garcia@university.edu', '+91 9876543219', 'CS2021-006', 'Computer Science', '4th Year', 8.9, '2003-01-22', 'Female', '741 Campus Boulevard'),
('Thomas Martin', 'thomas.martin@university.edu', '+91 9876543220', 'IT2021-004', 'Information Technology', '4th Year', 8.3, '2003-12-08', 'Male', '852 University Plaza');

-- Add skills for new students (using incremented IDs from base)
INSERT INTO student_skills (student_id, skill_name, proficiency_level, years_experience, category) VALUES
-- Sarah Williams 
(@student_start_id + 1, 'Python', 'Advanced', 2.5, 'Programming'),
(@student_start_id + 1, 'Django', 'Advanced', 1.5, 'Framework'),
(@student_start_id + 1, 'PostgreSQL', 'Intermediate', 1.5, 'Database'),
(@student_start_id + 1, 'Docker', 'Intermediate', 1.0, 'DevOps'),
(@student_start_id + 1, 'AWS', 'Beginner', 0.5, 'Cloud'),

-- David Brown
(@student_start_id + 2, 'Java', 'Advanced', 2.0, 'Programming'),
(@student_start_id + 2, 'Spring Boot', 'Intermediate', 1.5, 'Framework'),
(@student_start_id + 2, 'MySQL', 'Advanced', 2.0, 'Database'),
(@student_start_id + 2, 'Microservices', 'Intermediate', 1.0, 'Architecture'),

-- Emily Davis
(@student_start_id + 3, 'JavaScript', 'Expert', 3.0, 'Programming'),
(@student_start_id + 3, 'React', 'Expert', 2.5, 'Framework'),
(@student_start_id + 3, 'Vue.js', 'Advanced', 2.0, 'Framework'),
(@student_start_id + 3, 'Node.js', 'Advanced', 2.0, 'Backend'),
(@student_start_id + 3, 'TypeScript', 'Advanced', 2.0, 'Programming'),
(@student_start_id + 3, 'GraphQL', 'Intermediate', 1.0, 'API'),

-- Robert Wilson
(@student_start_id + 4, 'C++', 'Advanced', 2.5, 'Programming'),
(@student_start_id + 4, 'Python', 'Intermediate', 1.5, 'Programming'),
(@student_start_id + 4, 'Linux', 'Advanced', 2.0, 'OS'),
(@student_start_id + 4, 'Git', 'Advanced', 2.0, 'Version Control'),

-- Lisa Anderson
(@student_start_id + 5, 'Python', 'Advanced', 2.0, 'Programming'),
(@student_start_id + 5, 'Machine Learning', 'Advanced', 1.5, 'AI/ML'),
(@student_start_id + 5, 'Data Analysis', 'Advanced', 2.0, 'Analytics'),
(@student_start_id + 5, 'Pandas', 'Advanced', 1.5, 'Library'),
(@student_start_id + 5, 'Scikit-learn', 'Intermediate', 1.0, 'Library'),

-- James Taylor
(@student_start_id + 6, 'C', 'Advanced', 2.5, 'Programming'),
(@student_start_id + 6, 'Embedded Systems', 'Intermediate', 1.5, 'Hardware'),
(@student_start_id + 6, 'MATLAB', 'Intermediate', 1.0, 'Software'),
(@student_start_id + 6, 'IoT', 'Beginner', 0.5, 'Technology'),

-- Maria Garcia
(@student_start_id + 7, 'JavaScript', 'Advanced', 2.0, 'Programming'),
(@student_start_id + 7, 'React', 'Advanced', 1.5, 'Framework'),
(@student_start_id + 7, 'Node.js', 'Advanced', 1.5, 'Backend'),
(@student_start_id + 7, 'MongoDB', 'Intermediate', 1.0, 'Database'),
(@student_start_id + 7, 'Express.js', 'Advanced', 1.5, 'Framework'),

-- Thomas Martin
(@student_start_id + 8, 'Java', 'Advanced', 2.5, 'Programming'),
(@student_start_id + 8, 'Spring', 'Advanced', 2.0, 'Framework'),
(@student_start_id + 8, 'Hibernate', 'Intermediate', 1.5, 'Framework'),
(@student_start_id + 8, 'REST API', 'Advanced', 2.0, 'API'),
(@student_start_id + 8, 'Jenkins', 'Intermediate', 1.0, 'DevOps');

-- Add certifications for new students
INSERT INTO certifications (student_id, name, issuer, date_obtained, expiry_date, credential_id) VALUES
(@student_start_id + 1, 'AWS Certified Developer', 'Amazon Web Services', '2024-06-15', '2027-06-15', 'AWS-DEV-2024-001'),
(@student_start_id + 1, 'Python for Data Science', 'IBM', '2024-03-20', NULL, 'IBM-PY-2024-001'),
(@student_start_id + 2, 'Oracle Certified Java Programmer', 'Oracle', '2024-05-10', NULL, 'OCP-JAVA-2024-001'),
(@student_start_id + 3, 'React Advanced Certification', 'Meta', '2024-07-01', NULL, 'META-REACT-2024-001'),
(@student_start_id + 3, 'Full Stack Web Development', 'Coursera', '2024-04-15', NULL, 'CORS-FS-2024-001'),
(@student_start_id + 5, 'Machine Learning Specialization', 'Stanford Online', '2024-08-20', NULL, 'STAN-ML-2024-001'),
(@student_start_id + 7, 'MERN Stack Bootcamp', 'Udemy', '2024-02-28', NULL, 'UDM-MERN-2024-001'),
(@student_start_id + 8, 'Spring Framework Certification', 'Pivotal', '2024-05-25', '2026-05-25', 'PIV-SPR-2024-001');

-- Add internships for new students
INSERT INTO internships (student_id, company, role, start_date, end_date, description, skills, is_current) VALUES
(@student_start_id + 1, 'Amazon', 'Backend Developer Intern', '2024-05-01', '2024-08-31', 'Worked on microservices architecture and AWS deployment', '["Python", "Django", "AWS", "Docker"]', FALSE),
(@student_start_id + 2, 'Infosys', 'Java Developer Intern', '2024-06-01', '2024-08-31', 'Developed enterprise applications using Spring Boot', '["Java", "Spring Boot", "MySQL"]', FALSE),
(@student_start_id + 3, 'Google', 'Frontend Developer Intern', '2024-06-15', NULL, 'Working on internal dashboards and UI components', '["React", "TypeScript", "Material-UI"]', TRUE),
(@student_start_id + 5, 'Microsoft', 'Data Science Intern', '2024-05-15', '2024-08-15', 'Worked on predictive analytics and ML models', '["Python", "Machine Learning", "TensorFlow"]', FALSE),
(@student_start_id + 7, 'Flipkart', 'Full Stack Developer Intern', '2024-07-01', '2024-09-30', 'Developed e-commerce features using MERN stack', '["React", "Node.js", "MongoDB", "Express.js"]', FALSE),
(@student_start_id + 8, 'TCS', 'Java Developer Intern', '2024-05-01', '2024-07-31', 'Built REST APIs and microservices', '["Java", "Spring", "REST API"]', FALSE);

-- Add more companies
INSERT INTO companies (name, industry, location, description, website, contact_email, contact_phone) VALUES
('Microsoft India', 'Technology', 'Hyderabad', 'Global technology leader in software, services, and solutions', 'https://microsoft.com', 'careers@microsoft.com', '+91 40 66999999'),
('Amazon Development Centre', 'E-commerce & Cloud', 'Bangalore', 'World\'s largest online retailer and cloud services provider', 'https://amazon.com', 'jobs@amazon.in', '+91 80 67104000'),
('Google India', 'Technology', 'Bangalore', 'Search engine and technology company', 'https://google.com', 'careers@google.com', '+91 80 67218000'),
('Infosys', 'IT Services', 'Bangalore', 'Global leader in consulting, technology and outsourcing', 'https://infosys.com', 'placement@infosys.com', '+91 80 28520261'),
('Wipro', 'IT Services', 'Bangalore', 'Leading global IT, consulting and business process services', 'https://wipro.com', 'careers@wipro.com', '+91 80 28440011'),
('TCS', 'IT Services', 'Mumbai', 'Leading global IT services, consulting and business solutions', 'https://tcs.com', 'recruitment@tcs.com', '+91 22 67766000'),
('Flipkart', 'E-commerce', 'Bangalore', 'India\'s leading e-commerce marketplace', 'https://flipkart.com', 'hr@flipkart.com', '+91 80 39884000'),
('Paytm', 'Fintech', 'Noida', 'Digital payments and financial services company', 'https://paytm.com', 'jobs@paytm.com', '+91 120 4770770');

-- Add more jobs (using company IDs from base + new companies)
INSERT INTO jobs (company_id, title, description, required_skills, preferred_skills, job_type, location, package_min, package_max, eligibility_criteria, deadline, positions, status) VALUES
-- Microsoft (company_id = @company_start_id + 1)
(@company_start_id + 1, 'Software Engineer', 'Build innovative solutions for Microsoft products', '["C#", "Java", "Python", "Azure"]', '["Kubernetes", "Docker", "Microservices"]', 'Full-time', 'Hyderabad', 18.0, 22.0, '{"min_cgpa": 7.5, "departments": ["Computer Science", "Information Technology"]}', '2025-12-31', 10, 'active'),
(@company_start_id + 1, 'Cloud Solutions Engineer', 'Work with Azure cloud infrastructure', '["Azure", "Cloud Computing", "Networking"]', '["Python", "PowerShell"]', 'Full-time', 'Hyderabad', 16.0, 20.0, '{"min_cgpa": 7.5, "departments": ["Computer Science", "Information Technology"]}', '2025-12-31', 5, 'active'),

-- Amazon (company_id = @company_start_id + 2)
(@company_start_id + 2, 'SDE-1', 'Software Development Engineer role at Amazon', '["Java", "Python", "Data Structures", "Algorithms"]', '["AWS", "Distributed Systems"]', 'Full-time', 'Bangalore', 20.0, 25.0, '{"min_cgpa": 8.0, "departments": ["Computer Science", "Information Technology"]}', '2025-12-31', 15, 'active'),
(@company_start_id + 2, 'Frontend Engineer', 'Build customer-facing web applications', '["JavaScript", "React", "HTML", "CSS"]', '["TypeScript", "Redux"]', 'Full-time', 'Bangalore', 17.0, 21.0, '{"min_cgpa": 7.5, "departments": ["Computer Science", "Information Technology"]}', '2025-12-31', 8, 'active'),

-- Google (company_id = @company_start_id + 3)
(@company_start_id + 3, 'Software Engineer', 'Work on Google products and services', '["C++", "Java", "Python", "Algorithms"]', '["Machine Learning", "Distributed Systems"]', 'Full-time', 'Bangalore', 22.0, 28.0, '{"min_cgpa": 8.5, "departments": ["Computer Science"]}', '2025-12-31', 12, 'active'),

-- Infosys (company_id = @company_start_id + 4)
(@company_start_id + 4, 'Systems Engineer', 'Entry level software engineering position', '["Java", "Python", "SQL"]', '["Spring", "AWS"]', 'Full-time', 'Bangalore', 6.5, 8.0, '{"min_cgpa": 6.0, "departments": ["Computer Science", "Information Technology", "Electronics"]}', '2025-12-31', 50, 'active'),
(@company_start_id + 4, 'Digital Specialist Engineer', 'Work on digital transformation projects', '["JavaScript", "React", "Node.js"]', '["Angular", "Cloud"]', 'Full-time', 'Pune', 8.0, 10.0, '{"min_cgpa": 7.0, "departments": ["Computer Science", "Information Technology"]}', '2025-12-31', 30, 'active'),

-- Wipro (company_id = @company_start_id + 5)
(@company_start_id + 5, 'Project Engineer', 'Software development and client projects', '["Java", "Python", "SQL"]', '["Spring Boot", "Docker"]', 'Full-time', 'Bangalore', 6.0, 7.5, '{"min_cgpa": 6.5, "departments": ["Computer Science", "Information Technology"]}', '2025-12-31', 40, 'active'),

-- TCS (company_id = @company_start_id + 6)
(@company_start_id + 6, 'Assistant Systems Engineer', 'Entry level IT role at TCS', '["Programming Basics", "SQL", "Problem Solving"]', '["Java", "Python"]', 'Full-time', 'Mumbai', 5.5, 7.0, '{"min_cgpa": 6.0, "departments": ["Computer Science", "Information Technology", "Electronics"]}', '2025-12-31', 100, 'active'),
(@company_start_id + 6, 'Digital Cadre', 'Work on emerging technologies', '["Java", "Python", "JavaScript"]', '["React", "Node.js", "Cloud"]', 'Full-time', 'Bangalore', 7.0, 9.0, '{"min_cgpa": 7.5, "departments": ["Computer Science", "Information Technology"]}', '2025-12-31', 25, 'active'),

-- Flipkart (company_id = @company_start_id + 7)
(@company_start_id + 7, 'Software Development Engineer', 'Build scalable e-commerce solutions', '["Java", "Python", "Data Structures"]', '["Microservices", "Kafka"]', 'Full-time', 'Bangalore', 15.0, 18.0, '{"min_cgpa": 7.5, "departments": ["Computer Science", "Information Technology"]}', '2025-12-31', 20, 'active'),

-- Paytm (company_id = @company_start_id + 8)
(@company_start_id + 8, 'Software Engineer', 'Build fintech products and services', '["Java", "Python", "SQL"]', '["Spring Boot", "Redis"]', 'Full-time', 'Noida', 12.0, 15.0, '{"min_cgpa": 7.0, "departments": ["Computer Science", "Information Technology"]}', '2025-12-31', 15, 'active');

-- Get job IDs for applications
SET @job_start_id = (SELECT COALESCE(MAX(id), 0) FROM jobs) - 13;

-- Add more applications (using calculated student and job IDs)
INSERT INTO applications (student_id, job_id, cover_letter, status) VALUES
-- New students applying to new jobs
(@student_start_id + 1, @job_start_id + 2, 'I am excited about the Cloud Solutions Engineer role at Microsoft.', 'applied'),
(@student_start_id + 1, @job_start_id + 3, 'My AWS experience makes me a great fit for the SDE-1 role.', 'under-review'),
(@student_start_id + 2, @job_start_id + 6, 'I am interested in the Systems Engineer position at Infosys.', 'shortlisted'),
(@student_start_id + 2, @job_start_id + 8, 'Looking forward to contributing to Wipro as a Project Engineer.', 'applied'),
(@student_start_id + 3, @job_start_id + 4, 'My frontend expertise aligns perfectly with this role at Amazon.', 'interview-scheduled'),
(@student_start_id + 3, @job_start_id + 5, 'Excited about the opportunity to work at Google.', 'shortlisted'),
(@student_start_id + 4, @job_start_id + 6, 'Eager to start my career at Infosys as a Systems Engineer.', 'applied'),
(@student_start_id + 5, @job_start_id + 5, 'My ML background makes me suitable for Google\'s engineering role.', 'under-review'),
(@student_start_id + 5, @job_start_id + 3, 'I would love to work on Amazon\'s innovative products.', 'applied'),
(@student_start_id + 6, @job_start_id + 9, 'Interested in the Assistant Systems Engineer role at TCS.', 'applied'),
(@student_start_id + 7, @job_start_id + 11, 'My MERN stack experience is perfect for Flipkart\'s SDE role.', 'shortlisted'),
(@student_start_id + 7, @job_start_id + 7, 'Excited about digital transformation projects at Infosys.', 'applied'),
(@student_start_id + 8, @job_start_id + 12, 'I am passionate about fintech and would love to join Paytm.', 'applied'),
(@student_start_id + 8, @job_start_id + 10, 'My Java expertise aligns with TCS Digital Cadre requirements.', 'under-review'),

-- Existing students applying to new jobs
(1, @job_start_id + 1, 'Interested in Microsoft\'s engineering role.', 'applied'),
(1, @job_start_id + 5, 'Dream opportunity to work at Google.', 'selected'),
(2, @job_start_id + 3, 'Amazon SDE-1 is my top choice.', 'shortlisted'),
(2, @job_start_id + 5, 'Excited about working on Google products.', 'applied'),
(3, @job_start_id + 6, 'Looking forward to starting my career at Infosys.', 'applied');

