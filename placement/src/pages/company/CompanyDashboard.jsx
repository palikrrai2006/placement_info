import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsAPI, applicationsAPI } from '../../services/api';
import './CompanyDashboard.css';

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('jobs');
  const [loading, setLoading] = useState(true);
  
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    total_jobs: 0,
    total_applications: 0,
    shortlisted: 0,
    selected: 0
  });

  useEffect(() => {
    if (activeTab === 'jobs') {
      fetchJobs();
    } else if (activeTab === 'applications') {
      fetchApplications();
    }
  }, [activeTab]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [jobsRes, appsRes] = await Promise.all([
        jobsAPI.getAll(),
        applicationsAPI.getAll()
      ]);
      
      const jobsData = jobsRes.data || jobsRes;
      const appsData = appsRes.data || appsRes;
      
      setStats({
        total_jobs: jobsData.length,
        total_applications: appsData.length,
        shortlisted: appsData.filter(a => a.status === 'shortlisted').length,
        selected: appsData.filter(a => a.status === 'selected').length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await jobsAPI.getAll();
      setJobs(response.data || response);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await applicationsAPI.getAll();
      setApplications(response.data || response);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;
    
    try {
      await jobsAPI.delete(id);
      fetchJobs();
      fetchStats();
    } catch (error) {
      alert('Error deleting job: ' + error.message);
    }
  };

  const handleUpdateApplicationStatus = async (id, newStatus) => {
    try {
      await applicationsAPI.update(id, { status: newStatus });
      fetchApplications();
      fetchStats();
    } catch (error) {
      alert('Error updating application: ' + error.message);
    }
  };

  const statCards = [
    { label: 'Active Job Postings', value: stats.total_jobs, icon: '💼', color: '#3b82f6' },
    { label: 'Total Applications', value: stats.total_applications, icon: '📝', color: '#10b981' },
    { label: 'Shortlisted', value: stats.shortlisted, icon: '⭐', color: '#f59e0b' },
    { label: 'Selected', value: stats.selected, icon: '✅', color: '#8b5cf6' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/company/login');
  };

  return (
    <div className="company-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>🏢 Company Portal</h1>
            <p>Campus Recruitment Dashboard</p>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Stats Section */}
        <div className="stats-grid">
          {statCards.map((stat, index) => (
            <div key={index} className="stat-card" style={{ borderLeftColor: stat.color }}>
              <div className="stat-icon" style={{ color: stat.color }}>
                {stat.icon}
              </div>
              <div className="stat-info">
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="tabs-container">
          <button 
            className={`tab ${activeTab === 'jobs' ? 'active' : ''}`}
            onClick={() => setActiveTab('jobs')}
          >
            Job Postings
          </button>
          <button 
            className={`tab ${activeTab === 'applications' ? 'active' : ''}`}
            onClick={() => setActiveTab('applications')}
          >
            Applications
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'jobs' && (
          <div className="tab-content">
            <div className="content-card full-width">
              <div className="card-header">
                <h3>💼 Active Job Postings</h3>
                <button 
                  className="btn-add"
                  onClick={() => navigate('/company/add-job')}
                >
                  + Post New Job
                </button>
              </div>
              <div className="table-container">
                {jobs.length > 0 ? (
                  <table>
                    <thead>
                      <tr>
                        <th>Job Title</th>
                        <th>Job Type</th>
                        <th>Location</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobs.map((job) => (
                        <tr key={job.job_id}>
                          <td>{job.title}</td>
                          <td>{job.job_type}</td>
                          <td>{job.location}</td>
                          <td>
                            <span className={`badge badge-${job.status.toLowerCase()}`}>
                              {job.status}
                            </span>
                          </td>
                          <td>
                            <button 
                              className="btn-delete"
                              onClick={() => handleDeleteJob(job.job_id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="no-data">No jobs posted yet.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="tab-content">
            <div className="content-card full-width">
              <div className="card-header">
                <h3>📝 All Applications</h3>
              </div>
              <div className="table-container">
                {applications.length > 0 ? (
                  <table>
                    <thead>
                      <tr>
                        <th>Student Name</th>
                        <th>Job Title</th>
                        <th>Applied Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((app) => (
                        <tr key={app.id}>
                          <td>{app.student_name || 'N/A'}</td>
                          <td>{app.job_title || 'N/A'}</td>
                          <td>{new Date(app.applied_date).toLocaleDateString()}</td>
                          <td>
                            <span className={`badge badge-${app.status.toLowerCase()}`}>
                              {app.status}
                            </span>
                          </td>
                          <td>
                            <select 
                              className="status-select"
                              value={app.status}
                              onChange={(e) => handleUpdateApplicationStatus(app.id, e.target.value)}
                            >
                              <option value="applied">Applied</option>
                              <option value="under-review">Under Review</option>
                              <option value="shortlisted">Shortlisted</option>
                              <option value="interview-scheduled">Interview Scheduled</option>
                              <option value="selected">Selected</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="no-data">No applications received yet.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDashboard;
