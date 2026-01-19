import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import DashboardCard from '../../components/DashboardCard';
import PageHeader from '../../components/PageHeader';
import { analyticsAPI, applicationsAPI } from '../../services/api';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState({
    name: '',
    email: '',
    rollNumber: '',
    department: '',
    year: '',
    cgpa: '',
  });

  const [stats, setStats] = useState([
    {
      title: 'Applications Sent',
      value: '0',
      icon: '📝',
      subtitle: 'Total applications',
      trend: { type: 'up', value: '+3 this week' },
      bgColor: '#e0f2fe',
      onClick: () => navigate('/student/applications')
    },
    {
      title: 'Interviews Scheduled',
      value: '0',
      icon: '📅',
      subtitle: 'Upcoming interviews',
      trend: { type: 'up', value: '+2 new' },
      bgColor: '#dbeafe',
    },
    {
      title: 'Offers Received',
      value: '0',
      icon: '🎉',
      subtitle: 'Job offers',
      bgColor: '#dcfce7',
    },
    {
      title: 'Active Jobs',
      value: '0',
      icon: '💼',
      subtitle: 'Available positions',
      bgColor: '#fef3c7',
      onClick: () => navigate('/student/jobs')
    },
  ]);

  const [loading, setLoading] = useState(true);

  const [recentApplications, setRecentApplications] = useState([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);

  // Get logged-in user data
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.id) {
      setStudentData({
        name: user.fullName || user.full_name || '',
        email: user.email || '',
        rollNumber: user.rollNumber || user.roll_number || '',
        department: user.department || '',
        year: user.year || '',
        cgpa: user.cgpa || '',
      });
    } else {
      // If no user logged in, redirect to login
      navigate('/login');
    }
  }, [navigate]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        console.log('Fetching dashboard data...');
        
        // Fetch analytics stats
        const analyticsData = await analyticsAPI.getStats();
        console.log('Analytics data:', analyticsData);
        if (analyticsData.success) {
          const data = analyticsData.data;
          console.log('Stats data:', data);
          setStats([
            {
              title: 'Total Students',
              value: data.totalStudents.toString(),
              icon: '👥',
              subtitle: 'Registered students',
              bgColor: '#e0f2fe',
            },
            {
              title: 'Applications',
              value: data.totalApplications.toString(),
              icon: '📝',
              subtitle: 'Total applications',
              bgColor: '#dbeafe',
              onClick: () => navigate('/student/applications')
            },
            {
              title: 'Placed Students',
              value: data.placedStudents.toString(),
              icon: '🎉',
              subtitle: `${data.placementRate}% placement rate`,
              bgColor: '#dcfce7',
            },
            {
              title: 'Active Jobs',
              value: data.activeJobs.toString(),
              icon: '💼',
              subtitle: 'Available positions',
              bgColor: '#fef3c7',
              onClick: () => navigate('/student/jobs')
            },
          ]);
        }

        // Fetch recent applications (student_id = 1 for demo)
        const applicationsData = await applicationsAPI.getAll({ student_id: 1 });
        console.log('Applications data:', applicationsData);
        if (applicationsData.success) {
          setRecentApplications(applicationsData.data.slice(0, 5));
          console.log('Recent applications:', applicationsData.data.slice(0, 5));
          
          // Filter interview-scheduled applications
          const interviews = applicationsData.data
            .filter(app => app.status === 'interview-scheduled')
            .slice(0, 3);
          setUpcomingInterviews(interviews);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        alert('Failed to load dashboard data. Check console for details.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const getStatusBadge = (status) => {
    const statusStyles = {
      'confirmed': { bg: '#dcfce7', color: '#166534', text: 'Confirmed' },
      'pending': { bg: '#fef3c7', color: '#854d0e', text: 'Pending' },
      'under-review': { bg: '#dbeafe', color: '#1e40af', text: 'Under Review' },
      'shortlisted': { bg: '#dcfce7', color: '#166534', text: 'Shortlisted' },
      'rejected': { bg: '#fee2e2', color: '#991b1b', text: 'Rejected' },
    };

    const style = statusStyles[status] || statusStyles['pending'];
    
    return (
      <span 
        className="status-badge" 
        style={{ backgroundColor: style.bg, color: style.color }}
      >
        {style.text}
      </span>
    );
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading-state">Loading dashboard...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="student-dashboard">
      <PageHeader
        title={`Welcome back, ${studentData.name}!`}
        subtitle="Here's what's happening with your placement journey"
        breadcrumbs={[
          { label: 'Home', link: '/' },
          { label: 'Dashboard' }
        ]}
        actions={
          <button className="btn-primary" onClick={() => navigate('/student/jobs')}>
            Browse Jobs
          </button>
        }
      />

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <DashboardCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            subtitle={stat.subtitle}
            trend={stat.trend}
            bgColor={stat.bgColor}
            onClick={stat.onClick}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Upcoming Interviews */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Upcoming Interviews</h2>
            <Link to="/student/applications" className="view-all-link">
              View All →
            </Link>
          </div>
          
          {upcomingInterviews.length > 0 ? (
            <div className="interviews-list">
              {upcomingInterviews.map((interview) => (
                <div key={interview.id} className="interview-card">
                  <div className="interview-header">
                    <div>
                      <h3 className="interview-company">{interview.company_name}</h3>
                      <p className="interview-position">{interview.job_title}</p>
                    </div>
                    {getStatusBadge(interview.status)}
                  </div>
                  <div className="interview-details">
                    <div className="detail-item">
                      <span className="detail-icon">📅</span>
                      <span>{new Date(interview.updated_at).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">📧</span>
                      <span>{interview.student_email}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No upcoming interviews scheduled</p>
            </div>
          )}
        </div>

        {/* Recent Applications */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Recent Applications</h2>
            <Link to="/student/applications" className="view-all-link">
              View All →
            </Link>
          </div>
          
          <div className="applications-table">
            <table>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Position</th>
                  <th>Applied Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentApplications.length > 0 ? (
                  recentApplications.map((app) => (
                    <tr key={app.id}>
                      <td className="company-cell">{app.company_name}</td>
                      <td>{app.job_title}</td>
                      <td>{new Date(app.applied_date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}</td>
                      <td>{getStatusBadge(app.status)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{textAlign: 'center'}}>No applications yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>


      </div>
    </div>
    </Layout>
  );
};

export default StudentDashboard;
