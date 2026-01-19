import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CompanyLogin.css';

const CompanyLogin = () => {
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
    navigate('/company/dashboard');
  };

  return (
    <div className="company-login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-icon">🏢</div>
            <h1>Company Portal</h1>
            <p>Post jobs and hire talented students</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Company Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="hr@company.com"
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

export default CompanyLogin;
