import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CollegeLogin.css';

const CollegeLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, just navigate to dashboard
    navigate('/college/dashboard');
  };

  return (
    <div className="college-login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-icon">🏫</div>
            <h1>College Dashboard</h1>
            <p>Manage placements and student records</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">College Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@college.edu"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>

            <button type="submit" className="btn-login">
              Sign In
            </button>
          </form>

          <div className="login-footer">
            <button onClick={() => navigate('/')} className="btn-back">
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeLogin;
