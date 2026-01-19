import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentsAPI } from '../../services/api';
import './AddStudent.css';

const AddStudent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    roll_number: '',
    department: 'Computer Science',
    year: '4th Year',
    cgpa: '',
    date_of_birth: '',
    gender: 'Male',
    address: '',
    password_hash: ''
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
      // Validate required fields
      if (!formData.full_name || !formData.email || !formData.roll_number) {
        throw new Error('Please fill in all required fields');
      }

      const response = await studentsAPI.create(formData);
      
      setSuccess('Student added successfully!');
      
      // Reset form
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        roll_number: '',
        department: 'Computer Science',
        year: '4th Year',
        cgpa: '',
        date_of_birth: '',
        gender: 'Male',
        address: '',
        password_hash: ''
      });

      // Navigate back after 2 seconds
      setTimeout(() => {
        navigate('/college/dashboard');
      }, 2000);
      
    } catch (err) {
      setError(err.message || 'Failed to add student');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-student-container">
      <div className="add-student-header">
        <button className="back-button" onClick={() => navigate('/college/dashboard')}>
          ← Back to Dashboard
        </button>
        <h1>Add New Student</h1>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form className="add-student-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>Personal Information</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="full_name">Full Name *</label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                placeholder="Enter student name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="student@university.edu"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
              />
            </div>

            <div className="form-group">
              <label htmlFor="date_of_birth">Date of Birth</label>
              <input
                type="date"
                id="date_of_birth"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Hostel/Home address"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Academic Information</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="roll_number">Roll Number *</label>
              <input
                type="text"
                id="roll_number"
                name="roll_number"
                value={formData.roll_number}
                onChange={handleChange}
                required
                placeholder="CS2021-001"
              />
            </div>

            <div className="form-group">
              <label htmlFor="department">Department *</label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics">Electronics</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Civil">Civil</option>
                <option value="Electrical">Electrical</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="year">Year *</label>
              <select
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="cgpa">CGPA</label>
              <input
                type="number"
                id="cgpa"
                name="cgpa"
                value={formData.cgpa}
                onChange={handleChange}
                step="0.01"
                min="0"
                max="10"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Account Information</h2>
          
          <div className="form-group">
            <label htmlFor="password_hash">Password (Optional)</label>
            <input
              type="password"
              id="password_hash"
              name="password_hash"
              value={formData.password_hash}
              onChange={handleChange}
              placeholder="Leave empty for default password"
            />
            <small>If left empty, student can set password on first login</small>
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
            {loading ? 'Adding Student...' : 'Add Student'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStudent;
