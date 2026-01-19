import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    // TODO: Implement actual password reset
    console.log('Password reset for:', email);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="success-icon">✅</div>
            <h1>Check Your Email</h1>
            <p>
              We've sent password reset instructions to <strong>{email}</strong>
            </p>
          </div>

          <div className="info-box">
            <p>Didn't receive the email?</p>
            <ul>
              <li>Check your spam folder</li>
              <li>Verify the email address is correct</li>
              <li>Try again in a few minutes</li>
            </ul>
          </div>

          <Link to="/login" className="btn-back">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo-large">🔐</div>
          <h1>Forgot Password?</h1>
          <p>Enter your email to receive reset instructions</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              <span>⚠️</span> {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@university.edu"
              required
            />
          </div>

          <button type="submit" className="btn-submit">
            Send Reset Link
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Remember your password?{' '}
            <Link to="/login" className="link-primary">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
