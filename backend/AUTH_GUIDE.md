# Authentication System - Usage Guide

## Overview
Simple login/signup system with password storage and JWT validation.

## Endpoints

### 1. Signup - Create New Account
**POST** `/api/auth/signup`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "yourpassword",
  "fullName": "Full Name",
  "department": "Department Name",
  "rollNumber": "ROLL123" (optional)
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "token": "eyJhbGci...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "fullName": "Full Name"
    }
  }
}
```

### 2. Login - Authenticate User
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGci...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "fullName": "Full Name",
      "rollNumber": "ROLL123",
      "department": "IT"
    }
  }
}
```

### 3. Verify Token
**GET** `/api/auth/verify`

**Headers:**
```
Authorization: Bearer <your-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "fullName": "Full Name"
    }
  }
}
```

## Security Features
- ✅ Passwords hashed with bcrypt (10 salt rounds)
- ✅ JWT tokens with 7-day expiration
- ✅ Email uniqueness validation
- ✅ Password minimum length (6 characters)
- ✅ Input validation on all endpoints

## Test Account
- Email: `demo@test.com`
- Password: `demo123`

## Usage in Frontend

```javascript
// Signup
const signup = async (email, password, fullName, department) => {
  const response = await fetch('http://localhost:5000/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, fullName, department })
  });
  const data = await response.json();
  if (data.success) {
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
  }
  return data;
};

// Login
const login = async (email, password) => {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  if (data.success) {
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
  }
  return data;
};

// Verify Token
const verify = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:5000/api/auth/verify', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await response.json();
};

// Logout
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
```

## Database Schema
The system uses the existing `students` table with an added `password_hash` column:

```sql
ALTER TABLE students 
ADD COLUMN password_hash VARCHAR(255) NULL;
```

## Error Responses

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Email, password, and name are required"
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**409 Conflict:**
```json
{
  "success": false,
  "message": "Email already registered"
}
```

## Environment Variables
Add to `.env` file:
```
JWT_SECRET=placement-portal-secret-2025
```
