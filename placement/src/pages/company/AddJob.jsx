import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsAPI, companiesAPI } from '../../services/api';
import './AddJob.css';

const AddJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  
  const [formData, setFormData] = useState({
    company_id: '',
    title: '',
    description: '',
    job_type: 'Full-time',
    location: '',
    required_skills: '',
    preferred_skills: '',
    min_package: '',
    max_package: '',
    positions_available: 1,
    min_cgpa: 6.0,
    eligible_departments: '',
    application_deadline: '',
    status: 'Open'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await companiesAPI.getAll();
      setCompanies(response.data || response);
      // Auto-select first company if available
      if (response.data?.length > 0) {
        setFormData(prev => ({ ...prev, company_id: response.data[0].id }));
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.company_id) newErrors.company_id = 'Please select a company';
    if (!formData.title.trim()) newErrors.title = 'Job title is required';
    if (!formData.description.trim()) newErrors.description = 'Job description is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.required_skills.trim()) newErrors.required_skills = 'Required skills are required';
    if (!formData.min_package || formData.min_package <= 0) newErrors.min_package = 'Valid minimum package is required';
    if (!formData.max_package || formData.max_package <= 0) newErrors.max_package = 'Valid maximum package is required';
    if (parseFloat(formData.max_package) < parseFloat(formData.min_package)) {
      newErrors.max_package = 'Maximum package must be greater than minimum package';
    }
    if (!formData.positions_available || formData.positions_available <= 0) {
      newErrors.positions_available = 'Number of positions must be at least 1';
    }
    if (!formData.min_cgpa || formData.min_cgpa < 0 || formData.min_cgpa > 10) {
      newErrors.min_cgpa = 'CGPA must be between 0 and 10';
    }
    if (!formData.eligible_departments.trim()) {
      newErrors.eligible_departments = 'Eligible departments are required';
    }
    if (!formData.application_deadline) {
      newErrors.application_deadline = 'Application deadline is required';
    } else {
      const deadline = new Date(formData.application_deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (deadline < today) {
        newErrors.application_deadline = 'Deadline must be a future date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      // Prepare data for submission
      const jobData = {
        ...formData,
        company_id: parseInt(formData.company_id),
        positions_available: parseInt(formData.positions_available),
        min_cgpa: parseFloat(formData.min_cgpa),
        package_range: `${formData.min_package}-${formData.max_package} LPA`
      };

      await jobsAPI.create(jobData);
      alert('Job posting created successfully!');
      navigate('/company/dashboard');
    } catch (error) {
      alert('Error creating job: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const departmentOptions = [
    'Computer Science',
    'Information Technology',
    'Electronics',
    'Electrical',
    'Mechanical',
    'Civil',
    'All Departments'
  ];

  return (
    <div className="add-job-container">
      <div className="add-job-header">
        <button className="back-btn" onClick={() => navigate('/company/dashboard')}>
          ← Back to Dashboard
        </button>
        <h1>Post New Job</h1>
      </div>

      <form onSubmit={handleSubmit} className="add-job-form">
        <div className="form-section">
          <h2>Company Details</h2>
          <div className="form-group">
            <label htmlFor="company_id">Company *</label>
            <select
              id="company_id"
              name="company_id"
              value={formData.company_id}
              onChange={handleChange}
              className={errors.company_id ? 'error' : ''}
            >
              <option value="">Select Company</option>
              {companies.map(company => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
            {errors.company_id && <span className="error-message">{errors.company_id}</span>}
          </div>
        </div>

        <div className="form-section">
          <h2>Job Information</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Job Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Software Engineer"
                className={errors.title ? 'error' : ''}
              />
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="job_type">Job Type *</label>
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
          </div>

          <div className="form-group">
            <label htmlFor="description">Job Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide a detailed description of the role..."
              rows="6"
              className={errors.description ? 'error' : ''}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="location">Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Bangalore, Karnataka"
              className={errors.location ? 'error' : ''}
            />
            {errors.location && <span className="error-message">{errors.location}</span>}
          </div>
        </div>

        <div className="form-section">
          <h2>Skills & Requirements</h2>
          <div className="form-group">
            <label htmlFor="required_skills">Required Skills *</label>
            <input
              type="text"
              id="required_skills"
              name="required_skills"
              value={formData.required_skills}
              onChange={handleChange}
              placeholder="e.g., Python, Java, SQL (comma separated)"
              className={errors.required_skills ? 'error' : ''}
            />
            {errors.required_skills && <span className="error-message">{errors.required_skills}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="preferred_skills">Preferred Skills</label>
            <input
              type="text"
              id="preferred_skills"
              name="preferred_skills"
              value={formData.preferred_skills}
              onChange={handleChange}
              placeholder="e.g., React, Node.js, MongoDB (comma separated)"
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Compensation & Positions</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="min_package">Minimum Package (LPA) *</label>
              <input
                type="number"
                id="min_package"
                name="min_package"
                value={formData.min_package}
                onChange={handleChange}
                placeholder="e.g., 8"
                step="0.5"
                min="0"
                className={errors.min_package ? 'error' : ''}
              />
              {errors.min_package && <span className="error-message">{errors.min_package}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="max_package">Maximum Package (LPA) *</label>
              <input
                type="number"
                id="max_package"
                name="max_package"
                value={formData.max_package}
                onChange={handleChange}
                placeholder="e.g., 12"
                step="0.5"
                min="0"
                className={errors.max_package ? 'error' : ''}
              />
              {errors.max_package && <span className="error-message">{errors.max_package}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="positions_available">Number of Positions *</label>
              <input
                type="number"
                id="positions_available"
                name="positions_available"
                value={formData.positions_available}
                onChange={handleChange}
                min="1"
                className={errors.positions_available ? 'error' : ''}
              />
              {errors.positions_available && <span className="error-message">{errors.positions_available}</span>}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Eligibility Criteria</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="min_cgpa">Minimum CGPA *</label>
              <input
                type="number"
                id="min_cgpa"
                name="min_cgpa"
                value={formData.min_cgpa}
                onChange={handleChange}
                step="0.1"
                min="0"
                max="10"
                className={errors.min_cgpa ? 'error' : ''}
              />
              {errors.min_cgpa && <span className="error-message">{errors.min_cgpa}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="eligible_departments">Eligible Departments *</label>
              <input
                type="text"
                id="eligible_departments"
                name="eligible_departments"
                value={formData.eligible_departments}
                onChange={handleChange}
                placeholder="e.g., CSE, IT, ECE (comma separated) or All"
                className={errors.eligible_departments ? 'error' : ''}
              />
              <small>Enter department codes separated by commas, or type "All"</small>
              {errors.eligible_departments && <span className="error-message">{errors.eligible_departments}</span>}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Application Details</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="application_deadline">Application Deadline *</label>
              <input
                type="date"
                id="application_deadline"
                name="application_deadline"
                value={formData.application_deadline}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className={errors.application_deadline ? 'error' : ''}
              />
              {errors.application_deadline && <span className="error-message">{errors.application_deadline}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="status">Status *</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate('/company/dashboard')}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-submit"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Post Job'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddJob;
