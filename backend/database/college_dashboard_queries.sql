-- ============================================
-- COLLEGE DASHBOARD - SQL QUERIES
-- ============================================
-- These queries provide college-level placement analytics


-- ============================================
-- 1. DASHBOARD STATISTICS (Overview Cards)
-- ============================================

-- Total Students Count
SELECT COUNT(*) as total_students 
FROM students;

-- Companies Registered Count
SELECT COUNT(*) as total_companies 
FROM companies;

-- Active Placement Drives (Active Jobs)
SELECT COUNT(*) as active_drives 
FROM jobs 
WHERE status = 'active';

-- Total Placements Done (Students with selected status)
SELECT COUNT(DISTINCT student_id) as placements_done 
FROM applications 
WHERE status = 'selected';


-- ============================================
-- 2. COMBINED DASHBOARD STATS (Single Query)
-- ============================================

SELECT 
  (SELECT COUNT(*) FROM students) as total_students,
  (SELECT COUNT(*) FROM companies) as total_companies,
  (SELECT COUNT(*) FROM jobs WHERE status = 'active') as active_drives,
  (SELECT COUNT(DISTINCT student_id) FROM applications WHERE status = 'selected') as placements_done,
  (SELECT ROUND(AVG((package_min + package_max) / 2), 1) FROM jobs WHERE status = 'active') as avg_package;


-- ============================================
-- 3. RECENT STUDENTS
-- ============================================

SELECT 
  s.id,
  s.full_name as name,
  s.email,
  s.department as branch,
  s.cgpa,
  CASE 
    WHEN EXISTS (SELECT 1 FROM applications WHERE student_id = s.id AND status = 'selected') 
    THEN 'Placed'
    ELSE 'Eligible'
  END as status,
  s.created_at
FROM students s
ORDER BY s.created_at DESC
LIMIT 10;


-- ============================================
-- 4. ACTIVE COMPANIES WITH JOB DETAILS
-- ============================================

SELECT 
  c.id,
  c.name,
  c.industry,
  c.logo_url,
  COUNT(DISTINCT j.id) as openings,
  MIN(j.package_min) as package_min,
  MAX(j.package_max) as package_max,
  CONCAT(MIN(j.package_min), '-', MAX(j.package_max), ' LPA') as package_range,
  'Active' as status
FROM companies c
LEFT JOIN jobs j ON c.id = j.company_id AND j.status = 'active'
GROUP BY c.id, c.name, c.industry, c.logo_url
HAVING openings > 0
ORDER BY openings DESC;


-- ============================================
-- 5. UPCOMING PLACEMENT DRIVES
-- ============================================

SELECT 
  j.id,
  c.name as company,
  j.deadline as date,
  j.location as type,
  j.positions,
  j.title,
  CONCAT(j.package_min, '-', j.package_max, ' LPA') as package,
  j.status
FROM jobs j
JOIN companies c ON j.company_id = c.id
WHERE j.status = 'active' 
  AND j.deadline >= CURDATE()
ORDER BY j.deadline ASC
LIMIT 10;


-- ============================================
-- 6. BRANCH-WISE PLACEMENT STATISTICS
-- ============================================

SELECT 
  s.department as branch,
  COUNT(DISTINCT s.id) as total,
  COUNT(DISTINCT CASE WHEN a.status = 'selected' THEN s.id END) as placed,
  ROUND((COUNT(DISTINCT CASE WHEN a.status = 'selected' THEN s.id END) / COUNT(DISTINCT s.id)) * 100, 0) as percentage,
  ROUND(AVG(s.cgpa), 2) as avg_cgpa
FROM students s
LEFT JOIN applications a ON s.id = a.student_id
GROUP BY s.department
ORDER BY percentage DESC;


-- ============================================
-- 7. RECENT APPLICATIONS (Activity Feed)
-- ============================================

SELECT 
  a.id,
  s.full_name as student_name,
  s.department,
  c.name as company_name,
  j.title as job_title,
  a.status,
  a.applied_date,
  a.updated_at
FROM applications a
JOIN students s ON a.student_id = s.id
JOIN jobs j ON a.job_id = j.id
JOIN companies c ON j.company_id = c.id
ORDER BY a.applied_date DESC
LIMIT 20;


-- ============================================
-- 8. TOP PERFORMING STUDENTS
-- ============================================

SELECT 
  s.id,
  s.full_name,
  s.department,
  s.cgpa,
  COUNT(DISTINCT a.id) as applications,
  COUNT(DISTINCT CASE WHEN a.status = 'selected' THEN a.id END) as offers,
  MAX(CASE WHEN a.status = 'selected' THEN 'Placed' ELSE 'Eligible' END) as status
FROM students s
LEFT JOIN applications a ON s.id = a.student_id
GROUP BY s.id, s.full_name, s.department, s.cgpa
ORDER BY s.cgpa DESC
LIMIT 10;


-- ============================================
-- 9. COMPANY WISE HIRING STATS
-- ============================================

SELECT 
  c.id,
  c.name,
  c.industry,
  COUNT(DISTINCT j.id) as total_jobs,
  COUNT(DISTINCT a.id) as total_applications,
  COUNT(DISTINCT CASE WHEN a.status = 'selected' THEN a.student_id END) as students_hired,
  ROUND(AVG((j.package_min + j.package_max) / 2), 1) as avg_package
FROM companies c
LEFT JOIN jobs j ON c.id = j.company_id
LEFT JOIN applications a ON j.id = a.job_id
GROUP BY c.id, c.name, c.industry
HAVING total_jobs > 0
ORDER BY students_hired DESC;


-- ============================================
-- 10. MONTHLY PLACEMENT TRENDS
-- ============================================

SELECT 
  DATE_FORMAT(a.updated_at, '%Y-%m') as month,
  COUNT(DISTINCT CASE WHEN a.status = 'selected' THEN a.student_id END) as placements,
  COUNT(DISTINCT a.student_id) as total_applicants,
  ROUND((COUNT(DISTINCT CASE WHEN a.status = 'selected' THEN a.student_id END) / COUNT(DISTINCT a.student_id)) * 100, 1) as success_rate
FROM applications a
WHERE a.updated_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
GROUP BY month
ORDER BY month DESC;


-- ============================================
-- 11. DEPARTMENT WISE COMPANY PREFERENCES
-- ============================================

SELECT 
  s.department,
  c.name as company,
  COUNT(DISTINCT a.student_id) as applications,
  COUNT(DISTINCT CASE WHEN a.status = 'selected' THEN a.student_id END) as placements
FROM applications a
JOIN students s ON a.student_id = s.id
JOIN jobs j ON a.job_id = j.id
JOIN companies c ON j.company_id = c.id
GROUP BY s.department, c.name
ORDER BY s.department, applications DESC;


-- ============================================
-- 12. PACKAGE DISTRIBUTION ACROSS DEPARTMENTS
-- ============================================

SELECT 
  s.department,
  CASE 
    WHEN (j.package_min + j.package_max) / 2 < 5 THEN '0-5 LPA'
    WHEN (j.package_min + j.package_max) / 2 < 10 THEN '5-10 LPA'
    WHEN (j.package_min + j.package_max) / 2 < 15 THEN '10-15 LPA'
    WHEN (j.package_min + j.package_max) / 2 < 20 THEN '15-20 LPA'
    ELSE '20+ LPA'
  END as package_range,
  COUNT(DISTINCT a.student_id) as students
FROM applications a
JOIN students s ON a.student_id = s.id
JOIN jobs j ON a.job_id = j.id
WHERE a.status = 'selected'
GROUP BY s.department, package_range
ORDER BY s.department, 
  CASE package_range
    WHEN '0-5 LPA' THEN 1
    WHEN '5-10 LPA' THEN 2
    WHEN '10-15 LPA' THEN 3
    WHEN '15-20 LPA' THEN 4
    ELSE 5
  END;


-- ============================================
-- 13. STUDENTS ELIGIBLE FOR EACH DRIVE
-- ============================================

SELECT 
  j.id as job_id,
  j.title,
  c.name as company,
  j.deadline,
  COUNT(DISTINCT s.id) as eligible_students,
  j.positions
FROM jobs j
JOIN companies c ON j.company_id = c.id
CROSS JOIN students s
WHERE j.status = 'active'
  AND s.cgpa >= COALESCE(JSON_UNQUOTE(JSON_EXTRACT(j.eligibility_criteria, '$.min_cgpa')), 0)
  AND NOT EXISTS (
    SELECT 1 FROM applications a 
    WHERE a.student_id = s.id 
    AND a.job_id = j.id
  )
GROUP BY j.id, j.title, c.name, j.deadline, j.positions
ORDER BY j.deadline ASC;


-- ============================================
-- 14. APPLICATION STATUS BREAKDOWN
-- ============================================

SELECT 
  a.status,
  COUNT(*) as count,
  ROUND((COUNT(*) / (SELECT COUNT(*) FROM applications)) * 100, 1) as percentage
FROM applications a
GROUP BY a.status
ORDER BY count DESC;


-- ============================================
-- 15. YEAR-WISE PLACEMENT COMPARISON
-- ============================================

SELECT 
  s.year,
  COUNT(DISTINCT s.id) as total_students,
  COUNT(DISTINCT CASE WHEN a.status = 'selected' THEN s.id END) as placed,
  ROUND((COUNT(DISTINCT CASE WHEN a.status = 'selected' THEN s.id END) / COUNT(DISTINCT s.id)) * 100, 1) as placement_rate,
  ROUND(AVG(s.cgpa), 2) as avg_cgpa
FROM students s
LEFT JOIN applications a ON s.id = a.student_id
GROUP BY s.year
ORDER BY placement_rate DESC;


-- ============================================
-- 16. SKILLS IN DEMAND (COLLEGE PERSPECTIVE)
-- ============================================

SELECT 
  ss.skill_name,
  COUNT(DISTINCT ss.student_id) as students_with_skill,
  COUNT(DISTINCT CASE WHEN a.status = 'selected' THEN ss.student_id END) as placed_with_skill,
  ROUND((COUNT(DISTINCT CASE WHEN a.status = 'selected' THEN ss.student_id END) / 
         COUNT(DISTINCT ss.student_id)) * 100, 1) as placement_rate
FROM student_skills ss
LEFT JOIN applications a ON ss.student_id = a.student_id
GROUP BY ss.skill_name
HAVING students_with_skill >= 2
ORDER BY placement_rate DESC, students_with_skill DESC
LIMIT 10;


-- ============================================
-- 17. COLLEGE DASHBOARD OVERVIEW (ALL IN ONE)
-- ============================================

SELECT 
  -- Basic Stats
  (SELECT COUNT(*) FROM students) as total_students,
  (SELECT COUNT(*) FROM companies) as total_companies,
  (SELECT COUNT(*) FROM jobs WHERE status = 'active') as active_jobs,
  (SELECT COUNT(DISTINCT student_id) FROM applications WHERE status = 'selected') as total_placements,
  
  -- Placement Rate
  ROUND((SELECT COUNT(DISTINCT student_id) FROM applications WHERE status = 'selected') / 
        (SELECT COUNT(*) FROM students) * 100, 1) as overall_placement_rate,
  
  -- Average Package
  ROUND((SELECT AVG((package_min + package_max) / 2) FROM jobs 
         JOIN applications ON jobs.id = applications.job_id 
         WHERE applications.status = 'selected'), 1) as avg_placement_package,
  
  -- Highest Package
  (SELECT MAX(package_max) FROM jobs 
   JOIN applications ON jobs.id = applications.job_id 
   WHERE applications.status = 'selected') as highest_package,
  
  -- Applications Stats
  (SELECT COUNT(*) FROM applications) as total_applications,
  (SELECT COUNT(*) FROM applications WHERE status = 'under-review') as pending_applications,
  (SELECT COUNT(*) FROM applications WHERE status = 'shortlisted') as shortlisted_applications;
