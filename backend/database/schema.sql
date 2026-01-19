-- Placement Portal Database Schema

-- Create Students Table
CREATE TABLE IF NOT EXISTS students (
  id INT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20),
  roll_number VARCHAR(50) UNIQUE NOT NULL,
  department VARCHAR(100) NOT NULL,
  year VARCHAR(20) NOT NULL,
  cgpa DECIMAL(3,2) DEFAULT 0,
  date_of_birth DATE,
  gender ENUM('Male', 'Female', 'Other'),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_roll_number (roll_number),
  INDEX idx_department (department)
);

-- Create Student Skills Table
CREATE TABLE IF NOT EXISTS student_skills (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  skill_name VARCHAR(100) NOT NULL,
  proficiency_level ENUM('Beginner', 'Intermediate', 'Advanced', 'Expert') DEFAULT 'Beginner',
  years_experience DECIMAL(3,1) DEFAULT 0,
  category VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  INDEX idx_student_id (student_id),
  INDEX idx_skill_name (skill_name)
);

-- Create Certifications Table
CREATE TABLE IF NOT EXISTS certifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  name VARCHAR(200) NOT NULL,
  issuer VARCHAR(100) NOT NULL,
  date_obtained DATE NOT NULL,
  expiry_date DATE,
  credential_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  INDEX idx_student_id (student_id)
);

-- Create Internships Table
CREATE TABLE IF NOT EXISTS internships (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  company VARCHAR(200) NOT NULL,
  role VARCHAR(100) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  description TEXT,
  skills JSON,
  is_current BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  INDEX idx_student_id (student_id)
);

-- Create Companies Table
CREATE TABLE IF NOT EXISTS companies (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(200) NOT NULL,
  industry VARCHAR(100),
  location VARCHAR(200),
  description TEXT,
  website VARCHAR(255),
  logo_url VARCHAR(255),
  contact_email VARCHAR(100),
  contact_phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_name (name),
  INDEX idx_industry (industry)
);

-- Create Jobs Table
CREATE TABLE IF NOT EXISTS jobs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  company_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  required_skills JSON,
  preferred_skills JSON,
  job_type ENUM('Full-time', 'Part-time', 'Internship', 'Contract') DEFAULT 'Full-time',
  location VARCHAR(200),
  package_min DECIMAL(10,2),
  package_max DECIMAL(10,2),
  eligibility_criteria JSON,
  deadline DATE,
  positions INT DEFAULT 1,
  status ENUM('active', 'closed', 'draft') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  INDEX idx_company_id (company_id),
  INDEX idx_status (status),
  INDEX idx_deadline (deadline)
);

-- Create Applications Table
CREATE TABLE IF NOT EXISTS applications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  job_id INT NOT NULL,
  cover_letter TEXT,
  status ENUM('applied', 'under-review', 'shortlisted', 'interview-scheduled', 'selected', 'rejected') DEFAULT 'applied',
  notes TEXT,
  applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
  UNIQUE KEY unique_application (student_id, job_id),
  INDEX idx_student_id (student_id),
  INDEX idx_job_id (job_id),
  INDEX idx_status (status)
);

-- Insert Sample Data

-- Sample Students
INSERT INTO students (full_name, email, phone, roll_number, department, year, cgpa, date_of_birth, gender, address) VALUES
('John Doe', 'john.doe@university.edu', '+91 9876543210', 'CS2021-001', 'Computer Science', '4th Year', 8.5, '2003-05-15', 'Male', '123 University Road'),
('Jane Smith', 'jane.smith@university.edu', '+91 9876543211', 'CS2021-002', 'Computer Science', '4th Year', 9.0, '2003-03-20', 'Female', '456 Campus Street'),
('Mike Johnson', 'mike.johnson@university.edu', '+91 9876543212', 'IT2021-001', 'Information Technology', '4th Year', 8.2, '2003-07-10', 'Male', '789 College Avenue');

-- Sample Skills
INSERT INTO student_skills (student_id, skill_name, proficiency_level, years_experience, category) VALUES
(1, 'JavaScript', 'Advanced', 2.0, 'Programming'),
(1, 'React', 'Advanced', 1.5, 'Framework'),
(1, 'Node.js', 'Intermediate', 1.0, 'Backend'),
(1, 'SQL', 'Intermediate', 1.0, 'Database'),
(1, 'Python', 'Advanced', 2.0, 'Programming'),
(2, 'Python', 'Expert', 3.0, 'Programming'),
(2, 'Machine Learning', 'Advanced', 2.0, 'AI/ML'),
(2, 'TensorFlow', 'Advanced', 1.5, 'Framework'),
(3, 'Java', 'Advanced', 2.5, 'Programming'),
(3, 'Spring Boot', 'Intermediate', 1.0, 'Framework');

-- Sample Companies
INSERT INTO companies (name, industry, location, description, website, contact_email, contact_phone) VALUES
('Tech Corp', 'Technology', 'Bangalore', 'Leading technology solutions provider', 'https://techcorp.com', 'hr@techcorp.com', '+91 80 12345678'),
('Innovation Labs', 'Software', 'Hyderabad', 'Innovative software development company', 'https://innovationlabs.com', 'careers@innovationlabs.com', '+91 40 87654321'),
('Data Analytics Inc', 'Analytics', 'Pune', 'Data analytics and AI solutions', 'https://dataanalytics.com', 'jobs@dataanalytics.com', '+91 20 55555555');

-- Sample Jobs
INSERT INTO jobs (company_id, title, description, required_skills, preferred_skills, job_type, location, package_min, package_max, eligibility_criteria, deadline, positions, status) VALUES
(1, 'Software Engineer', 'Develop web applications using modern technologies', '["JavaScript", "React", "Node.js"]', '["TypeScript", "AWS"]', 'Full-time', 'Bangalore', 10.0, 15.0, '{"min_cgpa": 7.0, "departments": ["Computer Science", "Information Technology"]}', '2025-12-31', 5, 'active'),
(1, 'Frontend Developer', 'Build responsive user interfaces', '["HTML", "CSS", "JavaScript", "React"]', '["Redux", "Material-UI"]', 'Full-time', 'Bangalore', 8.0, 12.0, '{"min_cgpa": 7.0, "departments": ["Computer Science", "Information Technology"]}', '2025-12-31', 3, 'active'),
(2, 'Full Stack Developer', 'Work on end-to-end application development', '["JavaScript", "React", "Node.js", "MongoDB"]', '["Docker", "Kubernetes"]', 'Full-time', 'Hyderabad', 12.0, 16.0, '{"min_cgpa": 7.5, "departments": ["Computer Science"]}', '2025-12-31', 4, 'active'),
(3, 'Data Scientist', 'Analyze data and build ML models', '["Python", "Machine Learning", "SQL"]', '["TensorFlow", "PyTorch"]', 'Full-time', 'Pune', 14.0, 18.0, '{"min_cgpa": 8.0, "departments": ["Computer Science", "Information Technology"]}', '2025-12-31', 2, 'active');

-- Sample Applications
INSERT INTO applications (student_id, job_id, cover_letter, status) VALUES
(1, 1, 'I am very interested in this position and believe my skills match perfectly.', 'under-review'),
(1, 3, 'I have strong full-stack development skills and would love to contribute.', 'applied'),
(2, 4, 'My background in ML and data science makes me a great fit for this role.', 'shortlisted'),
(3, 1, 'Excited to apply my Java and Spring Boot knowledge to this role.', 'applied');
