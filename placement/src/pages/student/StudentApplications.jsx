import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import PageHeader from '../../components/PageHeader';
import { applicationsAPI } from '../../services/api';
import './StudentApplications.css';

const StudentApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        console.log('Fetching applications...');
        // Fetch applications for student_id = 1 (demo)
        const result = await applicationsAPI.getAll({ student_id: 1 });
        console.log('Applications API response:', result);
        
        if (result.success && result.data) {
          setApplications(result.data);
          console.log('Applications loaded:', result.data);
        } else {
          console.error('Invalid applications response:', result);
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
        alert('Failed to load applications. Check console for details.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const getStatusBadge = (status) => {
    const statusStyles = {
      'applied': { bg: '#dbeafe', color: '#1e40af', text: 'Applied' },
      'under-review': { bg: '#fef3c7', color: '#854d0e', text: 'Under Review' },
      'shortlisted': { bg: '#dbeafe', color: '#1e40af', text: 'Shortlisted' },
      'interview-scheduled': { bg: '#e0e7ff', color: '#3730a3', text: 'Interview Scheduled' },
      'selected': { bg: '#dcfce7', color: '#166534', text: 'Selected' },
      'rejected': { bg: '#fee2e2', color: '#991b1b', text: 'Rejected' },
    };
    const style = statusStyles[status] || statusStyles['applied'];
    return (
      <span style={{ backgroundColor: style.bg, color: style.color, padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '500' }}>
        {style.text}
      </span>
    );
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading-state">Loading applications...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="student-applications">
      <PageHeader
        title="My Applications"
        subtitle="Track and manage your job applications"
        breadcrumbs={[
          { label: 'Home', link: '/' },
          { label: 'Dashboard', link: '/student/dashboard' },
          { label: 'Applications' }
        ]}
      />

      <div className="applications-content">
        {/* Filters */}
        <div style={{ marginBottom: '20px' }}>
          <button onClick={() => setFilter('all')} style={{ marginRight: '10px', padding: '8px 16px', borderRadius: '6px', border: filter === 'all' ? '2px solid #3b82f6' : '1px solid #ddd', background: filter === 'all' ? '#eff6ff' : 'white' }}>
            All ({applications.length})
          </button>
          <button onClick={() => setFilter('applied')} style={{ marginRight: '10px', padding: '8px 16px', borderRadius: '6px', border: filter === 'applied' ? '2px solid #3b82f6' : '1px solid #ddd', background: filter === 'applied' ? '#eff6ff' : 'white' }}>
            Applied
          </button>
          <button onClick={() => setFilter('shortlisted')} style={{ marginRight: '10px', padding: '8px 16px', borderRadius: '6px', border: filter === 'shortlisted' ? '2px solid #3b82f6' : '1px solid #ddd', background: filter === 'shortlisted' ? '#eff6ff' : 'white' }}>
            Shortlisted
          </button>
          <button onClick={() => setFilter('selected')} style={{ marginRight: '10px', padding: '8px 16px', borderRadius: '6px', border: filter === 'selected' ? '2px solid #3b82f6' : '1px solid #ddd', background: filter === 'selected' ? '#eff6ff' : 'white' }}>
            Selected
          </button>
        </div>

        {/* Applications Cards Grid */}
        {filteredApplications.length > 0 ? (
          <div className="applications-grid">
            {filteredApplications.map((app) => (
              <div key={app.id} className="application-card">
                <div className="application-card-header">
                  <div className="company-logo">🏢</div>
                  <div className="company-info">
                    <h3 className="company-name">{app.company_name}</h3>
                    <p className="job-title">{app.job_title}</p>
                  </div>
                </div>
                
                <div className="application-details">
                  <div className="detail-item">
                    <span className="detail-label">Applied Date:</span>
                    <span className="detail-value">{new Date(app.applied_date).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Status:</span>
                    <span className="detail-value">{getStatusBadge(app.status)}</span>
                  </div>
                  
                  {app.job_location && (
                    <div className="detail-item">
                      <span className="detail-label">Location:</span>
                      <span className="detail-value">{app.job_location}</span>
                    </div>
                  )}
                  
                  {app.package_min && app.package_max && (
                    <div className="detail-item">
                      <span className="detail-label">Package:</span>
                      <span className="detail-value">{app.package_min}-{app.package_max} LPA</span>
                    </div>
                  )}
                </div>
                
                {app.cover_letter && (
                  <div className="cover-letter-preview">
                    <p className="cover-letter-text">{app.cover_letter.substring(0, 100)}...</p>
                  </div>
                )}
                
                <div className="application-card-footer">
                  <button className="btn-view-details">View Details</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="placeholder-card">
            <div className="placeholder-icon">📋</div>
            <h2>No Applications Yet</h2>
            <p>You haven't applied to any jobs yet. Start browsing opportunities!</p>
          </div>
        )}
      </div>
    </div>
    </Layout>
  );
};

export default StudentApplications;
