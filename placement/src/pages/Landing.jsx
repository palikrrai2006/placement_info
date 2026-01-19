import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();

  const userTypes = [
    {
      id: 'student',
      title: 'Student Portal',
      icon: '🎓',
      description: 'Access job opportunities, track applications, and manage your profile',
      features: [
        'Browse Job Openings',
        'Apply to Companies',
        'Track Application Status',
        'View Analytics'
      ],
      route: '/login',
      color: '#667eea'
    },
    {
      id: 'college',
      title: 'College Dashboard',
      icon: '🏫',
      description: 'Manage student placements, companies, and placement drives',
      features: [
        'Manage Students',
        'Company Relations',
        'Placement Analytics',
        'Drive Management'
      ],
      route: '/college/login',
      color: '#f59e0b',
      comingSoon: false
    },
    {
      id: 'company',
      title: 'Company Portal',
      icon: '🏢',
      description: 'Post jobs, review applications, and connect with talented students',
      features: [
        'Post Job Openings',
        'Review Applications',
        'Student Database',
        'Hiring Analytics'
      ],
      route: '/company/login',
      color: '#10b981',
      comingSoon: false
    }
  ];

  const handleCardClick = (userType) => {
    if (!userType.comingSoon) {
      navigate(userType.route);
    }
  };

  return (
    <div className="landing-page">
      <div className="landing-header">
        <div className="landing-logo">
          <span className="logo-icon">🎯</span>
          <h1>Placement Portal</h1>
        </div>
        <p className="landing-tagline">
          Connecting Students, Colleges, and Companies for Better Placements
        </p>
      </div>

      <div className="user-types-container">
        <h2 className="section-title">Choose Your Portal</h2>
        <div className="user-types-grid">
          {userTypes.map((userType) => (
            <div
              key={userType.id}
              className={`user-type-card ${userType.comingSoon ? 'coming-soon' : ''}`}
              onClick={() => handleCardClick(userType)}
              style={{ borderColor: userType.color }}
            >
              {userType.comingSoon && (
                <div className="coming-soon-badge">Coming Soon</div>
              )}
              
              <div className="card-icon" style={{ background: `${userType.color}15` }}>
                <span style={{ color: userType.color }}>{userType.icon}</span>
              </div>
              
              <h3 className="card-title" style={{ color: userType.color }}>
                {userType.title}
              </h3>
              
              <p className="card-description">{userType.description}</p>
              
              <div className="card-features">
                {userType.features.map((feature, index) => (
                  <div key={index} className="feature-item">
                    <span className="feature-icon">✓</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              
              <button
                className="card-button"
                style={{ 
                  background: userType.comingSoon ? '#9ca3af' : userType.color,
                  cursor: userType.comingSoon ? 'not-allowed' : 'pointer'
                }}
                disabled={userType.comingSoon}
              >
                {userType.comingSoon ? 'Coming Soon' : 'Get Started →'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <footer className="landing-footer">
        <div className="footer-content">
          <p>&copy; 2025 Placement Portal. All rights reserved.</p>
          <div className="footer-links">
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
            <a href="#help">Help</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
