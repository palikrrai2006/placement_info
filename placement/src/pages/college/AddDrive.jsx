import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsAPI, companiesAPI } from '../../services/api';
import './AddDrive.css';

const AddDrive = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [companies, setCompanies] = useState([]);

  const [formData, setFormData] = useState({
    company_id: '',
    title: '',
    description: '',
    required_skills: '',
    preferred_skills: '',
    job_type: 'Full-time',
    location: '',
    package_min: '',
    package_max: '',
    min_cgpa: '',
    eligible_departments: '',
    deadline: '',
    positions: '1',
    status: 'active'
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await companiesAPI.getAll();
      setCompanies(response.data || response);
    } catch (err) {
      console.error('Error fetching companies:', err);
    }
  };

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
      if (!formData.company_id || !formData.title) {
        throw new Error('Please fill in all required fields');
      }

      // Convert comma-separated skills to JSON array
      const requiredSkillsArray = formData.required_skills
        .split(',')
        .map(s => s.trim())
        .filter(s => s);
      
      const preferredSkillsArray = formData.preferred_skills
        .split(',')
        .map(s => s.trim())
        .filter(s => s);

      const eligibleDepartmentsArray = formData.eligible_departments
        .split(',')
        .map(s => s.trim())
        .filter(s => s);

      const jobData = {
        company_id: parseInt(formData.company_id),
        title: formData.title,
        description: formData.description,
        required_skills: JSON.stringify(requiredSkillsArray),
        preferred_skills: JSON.stringify(preferredSkillsArray),
        job_type: formData.job_type,
        location: formData.location,
        package_min: parseFloat(formData.package_min) || null,
        package_max: parseFloat(formData.package_max) || null,
        eligibility_criteria: JSON.stringify({
          min_cgpa: parseFloat(formData.min_cgpa) || 0,
          eligible_departments: eligibleDepartmentsArray
        }),
        deadline: formData.deadline || null,
        positions: parseInt(formData.positions) || 1,
        status: formData.status
      };

      await jobsAPI.create(jobData);
      
      setSuccess('Placement drive added successfully!');
      
      setFormData({
        company_id: '',
        title: '',
        description: '',
        required_skills: '',
        preferred_skills: '',
        job_type: 'Full-time',
        location: '',
        package_min: '',
        package_max: '',
        min_cgpa: '',
        eligible_departments: '',
        deadline: '',
        positions: '1',
        status: 'active'
      });

      setTimeout(() => {
        navigate('/college/dashboard');
      }, 2000);
      
    } catch (err) {
      setError(err.message || 'Failed to add placement drive');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-drive-container">
      <div className="add-drive-header">
        <button className="back-button" onClick={() => navigate('/college/dashboard')}>
          ← Back to Dashboard
        </button>
        <h1>Add Placement Drive</h1>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form className="add-drive-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>Job Details</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="company_id">Company *</label>
              <select
                id="company_id"
                name="company_id"
                value={formData.company_id}
                onChange={handleChange}
                required
              >
                <option value="">Select Company</option>
                {companies.map(company => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="title">Job Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Software Engineer, Data Analyst"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Job Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Detailed job description..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="job_type">Job Type</label>
              <select
                id="job_type"
                name="job_type"
                value={formData.job_type}
                onChange={handleChange}
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Bangalore, Remote"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="positions">Number of Positions</label>
              <input
                type="number"
                id="positions"
                name="positions"
                value={formData.positions}
                onChange={handleChange}
                min="1"
                placeholder="1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="deadline">Application Deadline</label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Skills & Requirements</h2>
          
          <div className="form-group">
            <label htmlFor="required_skills">Required Skills</label>
            <input
              type="text"
              id="required_skills"
              name="required_skills"
              value={formData.required_skills}
              onChange={handleChange}
              placeholder="Python, Java, SQL (comma separated)"
            />
            <small>Enter skills separated by commas</small>
          </div>

          <div className="form-group">
            <label htmlFor="preferred_skills">Preferred Skills</label>
            <input
              type="text"
              id="preferred_skills"
              name="preferred_skills"
              value={formData.preferred_skills}
              onChange={handleChange}
              placeholder="React, Node.js, AWS (comma separated)"
            />
            <small>Enter skills separated by commas</small>
          </div>
        </div>

        <div className="form-section">
          <h2>Package & Eligibility</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="package_min">Minimum Package (LPA)</label>
              <input
                type="number"
                id="package_min"
                name="package_min"
                value={formData.package_min}
                onChange={handleChange}
                step="0.1"
                min="0"
                placeholder="3.5"
              />
            </div>

            <div className="form-group">
              <label htmlFor="package_max">Maximum Package (LPA)</label>
              <input
                type="number"
                id="package_max"
                name="package_max"
                value={formData.package_max}
                onChange={handleChange}
                step="0.1"
                min="0"
                placeholder="6.0"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="min_cgpa">Minimum CGPA</label>
              <input
                type="number"
                id="min_cgpa"
                name="min_cgpa"
                value={formData.min_cgpa}
                onChange={handleChange}
                step="0.1"
                min="0"
                max="10"
                placeholder="7.0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="eligible_departments">Eligible Departments</label>
              <input
                type="text"
                id="eligible_departments"
                name="eligible_departments"
                value={formData.eligible_departments}
                onChange={handleChange}
                placeholder="Computer Science, IT, Electronics (comma separated)"
              />
              <small>Enter departments separated by commas, or leave empty for all</small>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="closed">Closed</option>
            </select>
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
            {loading ? 'Adding Drive...' : 'Add Placement Drive'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDrive;
