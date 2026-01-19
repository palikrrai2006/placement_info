import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { companiesAPI } from '../../services/api';
import './AddCompany.css';

const AddCompany = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    industry: 'Technology',
    location: '',
    description: '',
    website: '',
    logo_url: '',
    contact_email: '',
    contact_phone: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!formData.name || !formData.industry) {
        throw new Error('Please fill in all required fields');
      }

      await companiesAPI.create(formData);
      
      setSuccess('Company added successfully!');
      
      setFormData({
        name: '',
        industry: 'Technology',
        location: '',
        description: '',
        website: '',
        logo_url: '',
        contact_email: '',
        contact_phone: ''
      });

      setTimeout(() => {
        navigate('/college/dashboard');
      }, 2000);
      
    } catch (err) {
      setError(err.message || 'Failed to add company');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-company-container">
      <div className="add-company-header">
        <button className="back-button" onClick={() => navigate('/college/dashboard')}>
          ← Back to Dashboard
        </button>
        <h1>Add New Company</h1>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form className="add-company-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>Company Information</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Company Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter company name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="industry">Industry *</label>
              <select
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                required
              >
                <option value="Technology">Technology</option>
                <option value="IT Services">IT Services</option>
                <option value="E-commerce">E-commerce</option>
                <option value="FinTech">FinTech</option>
                <option value="Consulting">Consulting</option>
                <option value="Software">Software</option>
                <option value="Hardware">Hardware</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, State"
              />
            </div>

            <div className="form-group">
              <label htmlFor="website">Website</label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Brief description about the company..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="logo_url">Logo URL</label>
            <input
              type="url"
              id="logo_url"
              name="logo_url"
              value={formData.logo_url}
              onChange={handleChange}
              placeholder="https://example.com/logo.png"
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Contact Information</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="contact_email">Contact Email</label>
              <input
                type="email"
                id="contact_email"
                name="contact_email"
                value={formData.contact_email}
                onChange={handleChange}
                placeholder="hr@company.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact_phone">Contact Phone</label>
              <input
                type="tel"
                id="contact_phone"
                name="contact_phone"
                value={formData.contact_phone}
                onChange={handleChange}
                placeholder="+91 80 12345678"
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn-cancel" 
            onClick={() => navigate('/college/dashboard')}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn-submit" 
            disabled={loading}
          >
            {loading ? 'Adding Company...' : 'Add Company'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCompany;
