# Placement Portal Backend

Backend API for the Placement Portal application built with Node.js, Express, and MySQL.

## Features

- RESTful API endpoints
- MySQL database integration
- CORS enabled for frontend communication
- Environment-based configuration
- Comprehensive routes for students, companies, jobs, and analytics

## Prerequisites

- Node.js (v14 or higher)
- MySQL Database (Railway or local)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
   - Copy `.env` file and update with your database credentials
   - Update `DB_PASSWORD` with your actual Railway password

3. Create database tables:
   - Run the SQL schema from `database/schema.sql` in your MySQL database

## Running the Server

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

Server will start on `http://localhost:5000`

## API Endpoints

### Students
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student
- `POST /api/students/:id/skills` - Add skill to student
- `DELETE /api/students/:id/skills/:skillId` - Remove skill
- `POST /api/students/:id/certifications` - Add certification
- `POST /api/students/:id/internships` - Add internship

### Companies
- `GET /api/companies` - Get all companies
- `GET /api/companies/:id` - Get company by ID
- `POST /api/companies` - Create new company
- `PUT /api/companies/:id` - Update company
- `DELETE /api/companies/:id` - Delete company

### Jobs
- `GET /api/jobs` - Get all jobs (with filters)
- `GET /api/jobs/:id` - Get job by ID
- `POST /api/jobs` - Create new job
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

### Applications
- `GET /api/applications` - Get all applications (with filters)
- `GET /api/applications/:id` - Get application by ID
- `POST /api/applications` - Create new application
- `PUT /api/applications/:id` - Update application status
- `DELETE /api/applications/:id` - Delete application

### Analytics
- `GET /api/analytics/stats` - Get overall placement statistics
- `GET /api/analytics/departments` - Get department-wise stats
- `GET /api/analytics/skills` - Get top skills in demand
- `GET /api/analytics/companies` - Get top companies by placements
- `GET /api/analytics/applications/status` - Get application status distribution

### Health Check
- `GET /api/health` - Check API status

## Database Schema

The database includes the following tables:
- `students` - Student information
- `student_skills` - Student skills with proficiency levels
- `certifications` - Student certifications
- `internships` - Student internship experiences
- `companies` - Company information
- `jobs` - Job postings
- `applications` - Job applications

## Environment Variables

```env
DB_HOST=switchyard.proxy.rlwy.net
DB_PORT=11587
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=railway
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## Error Handling

All endpoints return JSON responses with the following structure:

Success:
```json
{
  "success": true,
  "data": { ... }
}
```

Error:
```json
{
  "success": false,
  "message": "Error description"
}
```

## CORS Configuration

CORS is enabled for the frontend URL specified in `.env` file. Update `FRONTEND_URL` to match your React app URL.
