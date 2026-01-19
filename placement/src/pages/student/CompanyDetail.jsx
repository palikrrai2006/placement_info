import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import PageHeader from '../../components/PageHeader';
import './CompanyDetail.css';

const CompanyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock company data - replace with API call
  const company = {
    id: parseInt(id),
    name: 'Tech Corp',
    logo: '🏢',
    sector: 'Technology',
    founded: '2010',
    size: '1000-5000 employees',
    headquarters: 'San Francisco, CA',
    website: 'https://techcorp.com',
    locations: ['Bangalore', 'Hyderabad', 'Pune'],
    package: '12-15 LPA',
    status: 'hiring',
    visitDate: '2025-12-05',
    registrationDeadline: '2025-12-01',
    description: 'Tech Corp is a leading technology solutions provider specializing in cloud computing, AI, and enterprise software. We build innovative products that help businesses transform digitally.',
    eligibility: {
      minCGPA: 7.0,
      branches: ['CS', 'IT', 'ECE'],
      backlogs: 'No active backlogs',
      graduationYear: 2026,
    },
    selectionProcess: [
      'Online Assessment (90 min)',
      'Technical Interview Round 1',
      'Technical Interview Round 2',
      'HR Interview',
    ],
    benefits: [
      'Health Insurance',
      'Flexible Work Hours',
      'Learning & Development Budget',
      'Performance Bonuses',
      'Stock Options',
      'Wellness Programs',
    ],
    openings: [
      {
        id: 1,
        title: 'Software Development Engineer',
        type: 'Full-time',
        location: 'Bangalore',
        package: '12-15 LPA',
        vacancies: 10,
        skills: ['Java', 'Python', 'React', 'Node.js', 'SQL'],
      },
      {
        id: 2,
        title: 'Frontend Developer',
        type: 'Full-time',
        location: 'Hyderabad',
        package: '10-13 LPA',
        vacancies: 5,
        skills: ['React', 'JavaScript', 'CSS', 'TypeScript'],
      },
      {
        id: 3,
        title: 'Data Analyst',
        type: 'Full-time',
        location: 'Pune',
        package: '9-12 LPA',
        vacancies: 3,
        skills: ['Python', 'SQL', 'Tableau', 'Excel'],
      },
    ],
  };

  const handleApply = (jobId) => {
    console.log(`Applying for job ${jobId} at ${company.name}`);
    // TODO: Implement application logic
    alert('Application submitted successfully!');
  };

  const getStatusBadge = (status) => {
    const styles = {
      hiring: { bg: '#dcfce7', color: '#166534', text: 'Hiring' },
      upcoming: { bg: '#dbeafe', color: '#1e40af', text: 'Upcoming' },
      closed: { bg: '#fee2e2', color: '#991b1b', text: 'Closed' },
    };
    const style = styles[status];
    return (
      <span className="status-badge" style={{ backgroundColor: style.bg, color: style.color }}>
        {style.text}
      </span>
    );
  };

  return (
    <Layout>
      <div className="company-detail-page">
        <PageHeader
          breadcrumbs={[
            { label: 'Home', link: '/' },
            { label: 'Dashboard', link: '/student/dashboard' },
            { label: 'Companies', link: '/student/companies' },
            { label: company.name }
          ]}
        />

        {/* Company Header */}
        <div className="company-detail-header">
          <div className="company-header-content">
            <div className="company-logo-large">{company.logo}</div>
            <div className="company-header-info">
              <div className="company-title-row">
                <h1>{company.name}</h1>
                {getStatusBadge(company.status)}
              </div>
              <p className="company-sector-detail">{company.sector}</p>
              <div className="company-meta">
                <span>📍 {company.headquarters}</span>
                <span>👥 {company.size}</span>
                <span>📅 Founded {company.founded}</span>
              </div>
            </div>
          </div>
          <div className="company-header-actions">
            <a href={company.website} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              Visit Website
            </a>
          </div>
        </div>

        {/* Key Info Cards */}
        <div className="key-info-cards">
          <div className="info-card">
            <div className="info-card-icon">💰</div>
            <div>
              <div className="info-label">Package Range</div>
              <div className="info-value">{company.package}</div>
            </div>
          </div>
          <div className="info-card">
            <div className="info-card-icon">📅</div>
            <div>
              <div className="info-label">Campus Visit</div>
              <div className="info-value">
                {new Date(company.visitDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
            </div>
          </div>
          <div className="info-card">
            <div className="info-card-icon">⏰</div>
            <div>
              <div className="info-label">Registration Deadline</div>
              <div className="info-value">
                {new Date(company.registrationDeadline).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
            </div>
          </div>
          <div className="info-card">
            <div className="info-card-icon">💼</div>
            <div>
              <div className="info-label">Active Openings</div>
              <div className="info-value">{company.openings.length} Positions</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs-container">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`tab ${activeTab === 'openings' ? 'active' : ''}`}
              onClick={() => setActiveTab('openings')}
            >
              Job Openings ({company.openings.length})
            </button>
            <button 
              className={`tab ${activeTab === 'eligibility' ? 'active' : ''}`}
              onClick={() => setActiveTab('eligibility')}
            >
              Eligibility
            </button>
            <button 
              className={`tab ${activeTab === 'process' ? 'active' : ''}`}
              onClick={() => setActiveTab('process')}
            >
              Selection Process
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'overview' && (
              <div className="overview-content">
                <section className="content-section">
                  <h2>About {company.name}</h2>
                  <p>{company.description}</p>
                </section>

                <section className="content-section">
                  <h2>Office Locations in India</h2>
                  <div className="locations-list">
                    {company.locations.map((location, index) => (
                      <div key={index} className="location-chip">
                        📍 {location}
                      </div>
                    ))}
                  </div>
                </section>

                <section className="content-section">
                  <h2>Benefits & Perks</h2>
                  <div className="benefits-grid">
                    {company.benefits.map((benefit, index) => (
                      <div key={index} className="benefit-item">
                        ✓ {benefit}
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'openings' && (
              <div className="openings-content">
                {company.openings.map((job) => (
                  <div key={job.id} className="job-opening-card">
                    <div className="job-header">
                      <div>
                        <h3>{job.title}</h3>
                        <div className="job-meta-info">
                          <span>📍 {job.location}</span>
                          <span>💰 {job.package}</span>
                          <span>👥 {job.vacancies} {job.vacancies === 1 ? 'vacancy' : 'vacancies'}</span>
                        </div>
                      </div>
                      <button 
                        className="btn-primary"
                        onClick={() => handleApply(job.id)}
                      >
                        Apply Now
                      </button>
                    </div>
                    <div className="job-skills">
                      <strong>Required Skills:</strong>
                      <div className="skills-list">
                        {job.skills.map((skill, index) => (
                          <span key={index} className="skill-tag">{skill}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'eligibility' && (
              <div className="eligibility-content">
                <div className="eligibility-grid">
                  <div className="eligibility-item">
                    <div className="eligibility-label">Minimum CGPA</div>
                    <div className="eligibility-value">{company.eligibility.minCGPA}</div>
                  </div>
                  <div className="eligibility-item">
                    <div className="eligibility-label">Eligible Branches</div>
                    <div className="eligibility-value">{company.eligibility.branches.join(', ')}</div>
                  </div>
                  <div className="eligibility-item">
                    <div className="eligibility-label">Backlogs Policy</div>
                    <div className="eligibility-value">{company.eligibility.backlogs}</div>
                  </div>
                  <div className="eligibility-item">
                    <div className="eligibility-label">Graduation Year</div>
                    <div className="eligibility-value">{company.eligibility.graduationYear}</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'process' && (
              <div className="process-content">
                <h2>Selection Rounds</h2>
                <div className="process-steps">
                  {company.selectionProcess.map((step, index) => (
                    <div key={index} className="process-step">
                      <div className="step-number">{index + 1}</div>
                      <div className="step-content">{step}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CompanyDetail;
