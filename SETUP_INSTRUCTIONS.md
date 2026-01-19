# Placement Portal Setup Instructions

## Prerequisites
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- MySQL Workbench (optional, for easier database management)

## Database Setup

### Step 1: Create Database
Open MySQL Workbench or MySQL command line and run:
```sql
CREATE DATABASE place;
USE place;
```

### Step 2: Run Schema (Create Tables)
1. Open `backend/database/schema.sql`
2. Execute the entire file in MySQL Workbench
   - This creates all tables: students, companies, jobs, applications, certifications, internships, etc.

### Step 3: Run Additional Data (Populate Sample Data)
1. Open `backend/database/additional_data.sql`
2. Execute the entire file in MySQL Workbench
   - This adds 11 students, 11 companies, 18 jobs, and multiple applications

### Step 4: Setup Authentication (REQUIRED)
Run this SQL query to add password support:
```sql
ALTER TABLE students 
ADD COLUMN password_hash VARCHAR(255) NULL AFTER email;
```

**OR** run the setup file:
```bash
mysql -u root -p place < backend/database/setup_auth.sql
```

**Important**: Run `schema.sql` BEFORE `additional_data.sql` BEFORE `setup_auth.sql`

## Backend Setup

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Configure Environment Variables
Create/Edit `backend/.env` file:

**For Local Development:**
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=place
PORT=5000
FRONTEND_URL=http://localhost:5173
```

**For Server/Production Deployment:**
```env
DB_HOST=your_server_ip_or_domain
DB_PORT=3306
DB_USER=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=place
PORT=5000
FRONTEND_URL=http://your-frontend-domain.com
```

Replace with your actual values:
- `DB_HOST`: Your MySQL server IP or domain (e.g., `192.168.1.100` or `db.yoursite.com`)
- `DB_USER`: MySQL username (often `root` or custom user)
- `DB_PASSWORD`: MySQL password
- `FRONTEND_URL`: Your frontend URL (e.g., `http://yoursite.com:5173` or `https://yoursite.com`)

### Step 3: Start Backend Server
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

## Frontend Setup

### Step 1: Install Dependencies
```bash
cd placement
npm install
```

### Step 2: Configure API URL
Edit `placement/src/services/api.js`:

**For Local Development:**
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

**For Server/Production:**
```javascript
const API_BASE_URL = 'http://your-backend-server:5000/api';
// OR with domain
const API_BASE_URL = 'http://api.yoursite.com/api';
// OR with HTTPS
const API_BASE_URL = 'https://api.yoursite.com/api';
```

Replace `your-backend-server` with actual server IP or domain.

### Step 3: Start Frontend
```bash
npm run dev
```

Frontend will run on `http://localhost:5173` (or configured port)

## Verify Setup

1. **Backend Health Check**: Open `http://localhost:5000/api/health` - Should see `{"status": "OK"}`

2. **Check Database Data**:
   ```sql
   USE place;
   SELECT COUNT(*) FROM students;   -- Should show 11
   SELECT COUNT(*) FROM companies;  -- Should show 11
   SELECT COUNT(*) FROM jobs;       -- Should show 18
   SELECT COUNT(*) FROM applications; -- Should show 24
   ```

3. **Frontend Dashboard**: Open `http://localhost:5173/student/dashboard`
   - Should see actual numbers (not 0s)
   - Total Students: 11
   - Total Applications: 24
   - Active Jobs: 18

## Troubleshooting

### Dashboard Shows All Zeros
**Problem**: Database is empty or backend not connected

**Solutions**:
1. Verify database has data: `SELECT COUNT(*) FROM students;`
2. Check if backend is running on port 5000
3. Check browser console for CORS errors
4. Verify `.env` file has correct database credentials

### CORS Errors
**Problem**: Frontend URL doesn't match FRONTEND_URL in backend .env

**Solution**: 
- **Local**: If frontend runs on different port (e.g., 5174), update `backend/.env`:
  ```env
  FRONTEND_URL=http://localhost:5174
  ```
- **Server**: Update with actual frontend URL:
  ```env
  FRONTEND_URL=http://your-frontend-server:5173
  # OR
  FRONTEND_URL=https://yoursite.com
  ```
- **Important**: Must include protocol (http:// or https://) and correct port
- Restart backend after changing .env

### Database Connection Failed
**Problem**: Wrong MySQL credentials

**Solution**:
1. Test MySQL connection: `mysql -u root -p`
2. Update `backend/.env` with correct password
3. Ensure MySQL service is running

### Foreign Key Constraint Errors (additional_data.sql)
**Problem**: Running additional_data.sql before schema.sql

**Solution**:
1. Drop database: `DROP DATABASE place;`
2. Recreate: `CREATE DATABASE place;`
3. Run `schema.sql` first, then `additional_data.sql`

## Project Structure
```
placement_info/
├── backend/              # Node.js/Express API
│   ├── config/          # Database configuration
│   ├── database/        # SQL files
│   ├── routes/          # API endpoints
│   └── server.js        # Entry point
├── placement/           # React frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   └── services/    # API client
│   └── package.json
└── SETUP_INSTRUCTIONS.md (this file)
```

## Default Login (When Auth is Implemented)
**Create your first account:**
- Go to: `http://localhost:5174/register`
- Fill in signup form
- Login with your credentials

**OR** create via API:
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@student.com","password":"test123","fullName":"Test User","department":"CS"}'
```

**Test Account (if exists):**
- Email: `demo@test.com`
- Password: `demo123`

## API Endpoints

### Authentication
- POST `/api/auth/signup` - Create new account (email, password, fullName required)
- POST `/api/auth/login` - Login and get JWT token
- GET `/api/auth/verify` - Verify JWT token validity

### Students & Data
- GET `/api/students` - Get all students
- GET `/api/companies` - Get all companies
- GET `/api/jobs` - Get all jobs
- GET `/api/applications` - Get all applications
- GET `/api/analytics/stats` - Get placement statistics
- POST `/api/students/:id/skills` - Add skill
- POST `/api/students/:id/certifications` - Add certification
- POST `/api/students/:id/internships` - Add internship

## Deployment Notes

### Server Deployment Checklist
1. ✅ MySQL installed and running on server
2. ✅ Database created and SQL files executed
3. ✅ Backend `.env` configured with server database details
4. ✅ Frontend `api.js` configured with backend server URL
5. ✅ CORS: Backend `FRONTEND_URL` matches frontend URL
6. ✅ Firewall: Ports 5000 (backend) and 5173 (frontend) open
7. ✅ Both services running: `npm run dev` in backend and frontend folders

### Common Server Setup Issues
- **Connection Refused**: Backend server IP/port incorrect in frontend `api.js`
- **CORS Error**: Backend `FRONTEND_URL` doesn't match actual frontend URL
- **Database Connection**: MySQL not accessible remotely (check MySQL bind-address)
- **Port Issues**: Firewall blocking ports 5000 or 5173

### Production Considerations
- Use `npm run build` for frontend (production build)
- Use PM2 or similar for backend process management
- Set up HTTPS with SSL certificates
- Use environment-specific .env files
- Configure MySQL for remote access if needed

## Support
If issues persist:
1. Check both terminal outputs (backend and frontend) for errors
2. Check browser console (F12) for JavaScript errors
3. Verify all dependencies installed: `npm install` in both folders
4. Confirm database has data: `SELECT COUNT(*) FROM students;`
5. Test backend API directly: `http://your-server:5000/api/health`
