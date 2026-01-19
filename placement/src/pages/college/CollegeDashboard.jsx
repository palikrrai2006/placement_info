import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collegeDashboardAPI, studentsAPI, companiesAPI, jobsAPI } from '../../services/api';
import './CollegeDashboard.css';

const CollegeDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('students');
  const [loading, setLoading] = useState(true);
  
  const [dashboardStats, setDashboardStats] = useState({
    total_students: 0,
    total_companies: 0,
    active_drives: 0,
    placements_done: 0,
  });
  
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [drives, setDrives] = useState([]);
  const [placementStats, setPlacementStats] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (activeTab === 'students') {
      fetchStudents();
    } else if (activeTab === 'companies') {
      fetchCompanies();
    } else if (activeTab === 'drives') {
      fetchDrives();
    }
  }, [activeTab]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [stats, branchStats] = await Promise.all([
        collegeDashboardAPI.getStats(),
        collegeDashboardAPI.getBranchWiseStats(),
      ]);

      setDashboardStats(stats.data || stats);
      setPlacementStats(branchStats.data || branchStats);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await studentsAPI.getAll();
      setStudents(response.data || response);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await companiesAPI.getAll();
      setCompanies(response.data || response);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const fetchDrives = async () => {
    try {
      const response = await jobsAPI.getAll();
      setDrives(response.data || response);
    } catch (error) {
      console.error('Error fetching drives:', error);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
    
    try {
      if (type === 'student') {
        await studentsAPI.delete(id);
        fetchStudents();
      } else if (type === 'company') {
        await companiesAPI.delete(id);
        fetchCompanies();
      } else if (type === 'drive') {
        await jobsAPI.delete(id);
        fetchDrives();
      }
      fetchDashboardData();
    } catch (error) {
      alert('Error deleting ' + type + ': ' + error.message);
    }
  };

  const stats = [
    { 
      label: 'Total Students', 
      value: dashboardStats.total_students || 0, 
      icon: '👨‍🎓', 
      color: '#3b82f6' 
    },
    { 
      label: 'Companies Registered', 
      value: dashboardStats.total_companies || 0, 
      icon: '🏢', 
      color: '#10b981' 
    },
    { 
      label: 'Active Drives', 
      value: dashboardStats.active_drives || 0, 
      icon: '📊', 
      color: '#f59e0b' 
    },
    { 
      label: 'Placements Done', 
      value: dashboardStats.placements_done || 0, 
      icon: '✅', 
      color: '#8b5cf6' 
    }
  ];

  if (loading) {
    return (
      <div className="college-dashboard">
        <header className="dashboard-header">
          <div className="header-content">
            <div className="header-left">
              <h1>🏫 College Dashboard</h1>
              <p>Loading...</p>
            </div>
          </div>
        </header>
        <div className="dashboard-content" style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="college-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>🏫 College Dashboard</h1>
            <p>Placement Management System</p>
          </div>
          <button onClick={() => navigate('/')} className="btn-logout">
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Stats Section */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
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
            className={`tab ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            Students
          </button>
          <button 
            className={`tab ${activeTab === 'companies' ? 'active' : ''}`}
            onClick={() => setActiveTab('companies')}
          >
            Companies
          </button>
          <button 
            className={`tab ${activeTab === 'drives' ? 'active' : ''}`}
            onClick={() => setActiveTab('drives')}
          >
            Placement Drives
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'students' && (
          <div className="tab-content">
            <div className="content-card full-width">
              <div className="card-header">
                <h3>👨‍🎓 All Students</h3>
                <button 
                  className="btn-primary" 
                  onClick={() => navigate('/college/add-student')}
                >
                  + Add Student
                </button>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Roll No</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Department</th>
                      <th>Year</th>
                      <th>CGPA</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(student => (
                      <tr key={student.id}>
                        <td>{student.roll_number}</td>
                        <td>{student.full_name}</td>
                        <td>{student.email}</td>
                        <td><span className="badge badge-branch">{student.department}</span></td>
                        <td>{student.year}</td>
                        <td>{student.cgpa}</td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="btn-sm btn-delete"
                              onClick={() => handleDelete('student', student.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {students.length === 0 && (
                  <div className="empty-state">
                    <p>No students found. Add your first student to get started.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'companies' && (
          <div className="tab-content">
            <div className="content-card full-width">
              <div className="card-header">
                <h3>🏢 All Companies</h3>
                <button 
                  className="btn-primary"
                  onClick={() => navigate('/college/add-company')}
                >
                  + Add Company
                </button>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Company Name</th>
                      <th>Industry</th>
                      <th>Location</th>
                      <th>Website</th>
                      <th>Contact</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companies.map(company => (
                      <tr key={company.id}>
                        <td><strong>{company.name}</strong></td>
                        <td><span className="badge badge-industry">{company.industry}</span></td>
                        <td>{company.location}</td>
                        <td>
                          {company.website && (
                            <a href={company.website} target="_blank" rel="noopener noreferrer">
                              🔗 Link
                            </a>
                          )}
                        </td>
                        <td>{company.contact_email}</td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="btn-sm btn-delete"
                              onClick={() => handleDelete('company', company.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {companies.length === 0 && (
                  <div className="empty-state">
                    <p>No companies registered. Add your first company to get started.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'drives' && (
          <div className="tab-content">
            <div className="content-card full-width">
              <div className="card-header">
                <h3>📊 Placement Drives</h3>
                <button 
                  className="btn-primary"
                  onClick={() => navigate('/college/add-drive')}
                >
                  + Add Drive
                </button>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Job Title</th>
                      <th>Company</th>
                      <th>Type</th>
                      <th>Location</th>
                      <th>Package (LPA)</th>
                      <th>Deadline</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {drives.map(drive => (
                      <tr key={drive.id}>
                        <td><strong>{drive.title}</strong></td>
                        <td>{drive.company_name}</td>
                        <td><span className="badge badge-type">{drive.job_type}</span></td>
                        <td>{drive.location}</td>
                        <td>
                          {drive.package_min && drive.package_max 
                            ? `${drive.package_min}-${drive.package_max}`
                            : 'Not Specified'
                          }
                        </td>
                        <td>
                          {drive.deadline 
                            ? new Date(drive.deadline).toLocaleDateString()
                            : 'No deadline'
                          }
                        </td>
                        <td>
                          <span className={`badge badge-${drive.status}`}>
                            {drive.status}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="btn-sm btn-delete"
                              onClick={() => handleDelete('drive', drive.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {drives.length === 0 && (
                  <div className="empty-state">
                    <p>No placement drives scheduled. Add your first drive to get started.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollegeDashboard;
