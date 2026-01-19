# Backend Setup Guide

## Step-by-Step Setup Instructions

### 1. Update Database Password

Open `backend/.env` and replace `YourActualPasswordHere` with your actual Railway database password:

```env
DB_PASSWORD=your_actual_railway_password
```

### 2. Run the Database Schema

You need to create the database tables. You have two options:

#### Option A: Using MySQL Workbench or phpMyAdmin
1. Connect to your Railway database using the credentials
2. Open and execute the `backend/database/schema.sql` file

#### Option B: Using MySQL Command Line
```bash
mysql -h switchyard.proxy.rlwy.net -P 11587 -u root -p railway < backend/database/schema.sql
```
(Enter your password when prompted)

### 3. Start the Backend Server

```bash
cd backend
npm run dev
```

You should see:
```
✅ Database connected successfully
🚀 Server running on port 5000
📍 API URL: http://localhost:5000
🌐 Environment: development
```

### 4. Test the API

Open your browser or use curl:
```bash
# Health check
curl http://localhost:5000/api/health

# Get all students
curl http://localhost:5000/api/students

# Get all jobs
curl http://localhost:5000/api/jobs
```

### 5. Update Frontend to Use Backend

In your React app, create an API service file:

**src/services/api.js:**
```javascript
const API_URL = 'http://localhost:5000/api';

export const api = {
  // Students
  getStudents: () => fetch(`${API_URL}/students`).then(r => r.json()),
  getStudent: (id) => fetch(`${API_URL}/students/${id}`).then(r => r.json()),
  
  // Jobs
  getJobs: () => fetch(`${API_URL}/jobs`).then(r => r.json()),
  getJob: (id) => fetch(`${API_URL}/jobs/${id}`).then(r => r.json()),
  
  // Applications
  getApplications: (studentId) => 
    fetch(`${API_URL}/applications?student_id=${studentId}`).then(r => r.json()),
  
  createApplication: (data) =>
    fetch(`${API_URL}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),
  
  // Analytics
  getAnalytics: () => fetch(`${API_URL}/analytics/stats`).then(r => r.json()),
  getDepartmentStats: () => fetch(`${API_URL}/analytics/departments`).then(r => r.json()),
};
```

## Troubleshooting

### Database Connection Failed
- Verify your Railway password in `.env`
- Check if Railway database is running
- Ensure your IP is whitelisted (Railway usually allows all)

### Port Already in Use
Change the PORT in `.env`:
```env
PORT=5001
```

### CORS Errors
Update `FRONTEND_URL` in `.env` to match your React app:
```env
FRONTEND_URL=http://localhost:5173
```

## Sample Data

The schema includes sample data:
- 3 Students (John Doe, Jane Smith, Mike Johnson)
- 3 Companies (Tech Corp, Innovation Labs, Data Analytics Inc)
- 4 Job Postings
- 4 Applications

You can use this data for testing!
