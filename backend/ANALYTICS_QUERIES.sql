-- ============================================
-- ANALYTICS DASHBOARD - ALL SQL QUERIES
-- ============================================
-- These are the queries used by /api/analytics/* endpoints


-- ============================================
-- 1. PLACEMENT STATISTICS (/api/analytics/stats)
-- ============================================

-- Total students count
SELECT COUNT(*) as count FROM students;

-- Total applications count
SELECT COUNT(*) as count FROM applications;

-- Placed students count (students with 'selected' status)
SELECT COUNT(DISTINCT student_id) as count 
FROM applications 
WHERE status = 'selected';

-- Active jobs count
SELECT COUNT(*) as count 
FROM jobs 
WHERE status = 'active';

-- Average package from active jobs
SELECT AVG((package_min + package_max) / 2) as average 
FROM jobs 
WHERE status = 'active';

-- Placement rate calculation
-- Formula: (Placed Students / Total Students) * 100
SELECT 
  (COUNT(DISTINCT CASE WHEN a.status = 'selected' THEN a.student_id END) / COUNT(DISTINCT s.id)) * 100 as placement_rate
FROM students s
LEFT JOIN applications a ON s.id = a.student_id;


-- ============================================
-- 2. DEPARTMENT-WISE STATISTICS (/api/analytics/departments)
-- ============================================

SELECT 
  s.department,
  COUNT(DISTINCT s.id) as total_students,
  COUNT(DISTINCT CASE WHEN a.status = 'selected' THEN s.id END) as placed_students,
  AVG(s.cgpa) as average_cgpa,
  ROUND((COUNT(DISTINCT CASE WHEN a.status = 'selected' THEN s.id END) / COUNT(DISTINCT s.id)) * 100, 2) as placement_rate
FROM students s
LEFT JOIN applications a ON s.id = a.student_id
GROUP BY s.department
ORDER BY placement_rate DESC;


-- ============================================
-- 3. TOP SKILLS IN DEMAND (/api/analytics/skills)
-- ============================================

SELECT 
  skill_name,
  COUNT(*) as demand_count,
  AVG(proficiency_level) as avg_proficiency
FROM student_skills
GROUP BY skill_name
ORDER BY demand_count DESC
LIMIT 10;


-- ============================================
-- 4. TOP COMPANIES BY PLACEMENTS (/api/analytics/companies)
-- ============================================

SELECT 
  c.name,
  c.industry,
  COUNT(DISTINCT a.id) as total_applications,
  COUNT(DISTINCT CASE WHEN a.status = 'selected' THEN a.id END) as placements,
  AVG((j.package_min + j.package_max) / 2) as avg_package
FROM companies c
LEFT JOIN jobs j ON c.id = j.company_id
LEFT JOIN applications a ON j.id = a.job_id
GROUP BY c.id
ORDER BY placements DESC
LIMIT 10;


-- ============================================
-- 5. APPLICATION STATUS DISTRIBUTION (/api/analytics/applications/status)
-- ============================================

SELECT 
  status,
  COUNT(*) as count
FROM applications
GROUP BY status;


-- ============================================
-- 6. PACKAGE DISTRIBUTION (/api/analytics/package-distribution)
-- ============================================

SELECT 
  CASE 
    WHEN (j.package_min + j.package_max) / 2 < 5 THEN '0-5 LPA'
    WHEN (j.package_min + j.package_max) / 2 < 10 THEN '5-10 LPA'
    WHEN (j.package_min + j.package_max) / 2 < 15 THEN '10-15 LPA'
    WHEN (j.package_min + j.package_max) / 2 < 20 THEN '15-20 LPA'
    ELSE '20+ LPA'
  END as package_range,
  COUNT(DISTINCT a.student_id) as count
FROM applications a
JOIN jobs j ON a.job_id = j.id
WHERE a.status = 'selected'
GROUP BY package_range
ORDER BY 
  CASE 
    WHEN package_range = '0-5 LPA' THEN 1
    WHEN package_range = '5-10 LPA' THEN 2
    WHEN package_range = '10-15 LPA' THEN 3
    WHEN package_range = '15-20 LPA' THEN 4
    ELSE 5
  END;


-- ============================================
-- ADDITIONAL USEFUL QUERIES FOR ANALYTICS
-- ============================================

-- Top performing students (by CGPA with placements)
SELECT 
  s.id,
  s.full_name,
  s.department,
  s.cgpa,
  COUNT(DISTINCT a.id) as applications,
  MAX(CASE WHEN a.status = 'selected' THEN 1 ELSE 0 END) as is_placed
FROM students s
LEFT JOIN applications a ON s.id = a.student_id
GROUP BY s.id
ORDER BY s.cgpa DESC
LIMIT 10;

-- Skills gap analysis (skills in jobs vs skills students have)
SELECT 
  j.required_skills,
  COUNT(*) as jobs_requiring
FROM jobs j
WHERE j.status = 'active'
GROUP BY j.required_skills;

-- Monthly application trends
SELECT 
  DATE_FORMAT(applied_date, '%Y-%m') as month,
  COUNT(*) as applications,
  COUNT(CASE WHEN status = 'selected' THEN 1 END) as placements
FROM applications
GROUP BY month
ORDER BY month DESC;

-- Companies with highest average packages
SELECT 
  c.name,
  AVG((j.package_min + j.package_max) / 2) as avg_package,
  COUNT(j.id) as total_jobs
FROM companies c
JOIN jobs j ON c.id = j.company_id
WHERE j.status = 'active'
GROUP BY c.id
ORDER BY avg_package DESC
LIMIT 10;

-- Student application success rate
SELECT 
  s.id,
  s.full_name,
  COUNT(a.id) as total_applications,
  COUNT(CASE WHEN a.status = 'selected' THEN 1 END) as offers,
  COUNT(CASE WHEN a.status = 'shortlisted' THEN 1 END) as shortlisted,
  COUNT(CASE WHEN a.status = 'rejected' THEN 1 END) as rejected,
  ROUND((COUNT(CASE WHEN a.status = 'selected' THEN 1 END) / COUNT(a.id)) * 100, 2) as success_rate
FROM students s
LEFT JOIN applications a ON s.id = a.student_id
GROUP BY s.id
HAVING total_applications > 0
ORDER BY success_rate DESC;

-- Department-wise average package
SELECT 
  s.department,
  AVG((j.package_min + j.package_max) / 2) as avg_package_offered,
  COUNT(DISTINCT CASE WHEN a.status = 'selected' THEN s.id END) as students_placed
FROM students s
JOIN applications a ON s.id = a.student_id
JOIN jobs j ON a.job_id = j.id
WHERE a.status = 'selected'
GROUP BY s.department
ORDER BY avg_package_offered DESC;

-- Skills proficiency distribution
SELECT 
  skill_name,
  proficiency_level,
  COUNT(*) as student_count
FROM student_skills
GROUP BY skill_name, proficiency_level
ORDER BY skill_name, 
  CASE proficiency_level
    WHEN 'Expert' THEN 1
    WHEN 'Advanced' THEN 2
    WHEN 'Intermediate' THEN 3
    WHEN 'Beginner' THEN 4
  END;

-- Job types distribution
SELECT 
  job_type,
  COUNT(*) as count,
  AVG((package_min + package_max) / 2) as avg_package
FROM jobs
WHERE status = 'active'
GROUP BY job_type;

-- Companies by industry hiring stats
SELECT 
  c.industry,
  COUNT(DISTINCT c.id) as companies,
  COUNT(DISTINCT j.id) as jobs,
  COUNT(DISTINCT CASE WHEN a.status = 'selected' THEN a.student_id END) as placements
FROM companies c
LEFT JOIN jobs j ON c.id = j.company_id
LEFT JOIN applications a ON j.id = a.job_id
GROUP BY c.industry
ORDER BY placements DESC;

-- Year-wise placement statistics
SELECT 
  s.year,
  COUNT(DISTINCT s.id) as total_students,
  COUNT(DISTINCT CASE WHEN a.status = 'selected' THEN s.id END) as placed,
  ROUND((COUNT(DISTINCT CASE WHEN a.status = 'selected' THEN s.id END) / COUNT(DISTINCT s.id)) * 100, 2) as placement_rate
FROM students s
LEFT JOIN applications a ON s.id = a.student_id
GROUP BY s.year
ORDER BY placement_rate DESC;

-- Skills most in demand by companies (from job requirements)
SELECT 
  JSON_UNQUOTE(JSON_EXTRACT(required_skills, CONCAT('$[', numbers.n, ']'))) as skill,
  COUNT(*) as demand_count
FROM jobs
JOIN (
  SELECT 0 as n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 
  UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9
) numbers
WHERE JSON_EXTRACT(required_skills, CONCAT('$[', numbers.n, ']')) IS NOT NULL
GROUP BY skill
ORDER BY demand_count DESC
LIMIT 10;

-- Student eligibility for active jobs
SELECT 
  s.id,
  s.full_name,
  s.cgpa,
  s.department,
  COUNT(DISTINCT j.id) as eligible_jobs
FROM students s
CROSS JOIN jobs j
WHERE j.status = 'active'
  AND s.cgpa >= JSON_UNQUOTE(JSON_EXTRACT(j.eligibility_criteria, '$.min_cgpa'))
GROUP BY s.id
ORDER BY eligible_jobs DESC;

-- Application timeline (average time between statuses)
SELECT 
  status,
  AVG(DATEDIFF(updated_at, applied_date)) as avg_days
FROM applications
GROUP BY status
ORDER BY 
  CASE status
    WHEN 'applied' THEN 1
    WHEN 'under-review' THEN 2
    WHEN 'shortlisted' THEN 3
    WHEN 'interview-scheduled' THEN 4
    WHEN 'selected' THEN 5
    WHEN 'rejected' THEN 6
  END;


-- ============================================
-- DATA VERIFICATION QUERIES
-- ============================================

-- Check data completeness
SELECT 
  'Students' as entity,
  COUNT(*) as count,
  COUNT(CASE WHEN password_hash IS NOT NULL THEN 1 END) as with_password,
  COUNT(CASE WHEN cgpa > 0 THEN 1 END) as with_cgpa
FROM students
UNION ALL
SELECT 
  'Skills',
  COUNT(*),
  COUNT(DISTINCT student_id),
  COUNT(CASE WHEN proficiency_level IS NOT NULL THEN 1 END)
FROM student_skills
UNION ALL
SELECT 
  'Companies',
  COUNT(*),
  COUNT(CASE WHEN website IS NOT NULL THEN 1 END),
  COUNT(CASE WHEN contact_email IS NOT NULL THEN 1 END)
FROM companies
UNION ALL
SELECT 
  'Jobs',
  COUNT(*),
  COUNT(CASE WHEN status = 'active' THEN 1 END),
  COUNT(CASE WHEN package_min IS NOT NULL THEN 1 END)
FROM jobs
UNION ALL
SELECT 
  'Applications',
  COUNT(*),
  COUNT(DISTINCT student_id),
  COUNT(CASE WHEN status = 'selected' THEN 1 END)
FROM applications;
