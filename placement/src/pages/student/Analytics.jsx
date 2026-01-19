import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import PageHeader from '../../components/PageHeader';
import { analyticsAPI } from '../../services/api';
import './Analytics.css';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    overview: {
      totalStudents: 0,
      placed: 0,
      inProcess: 0,
      notPlaced: 0,
      placementRate: 0,
      averagePackage: 0,
      highestPackage: 0,
    },
    departmentStats: [],
    topSkills: [],
    packageDistribution: [
      { range: '0-5 LPA', count: 0 },
      { range: '5-10 LPA', count: 0 },
      { range: '10-15 LPA', count: 0 },
      { range: '15-20 LPA', count: 0 },
      { range: '20+ LPA', count: 0 },
    ],
    topCompanies: [],
    skillGapInsights: [],
    trainingRecommendations: [],
  });

  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Fetch all analytics data in parallel
      const [stats, departments, skills, companies, applicationStatus, packageDist] = await Promise.all([
        analyticsAPI.getStats(),
        analyticsAPI.getDepartments(),
        analyticsAPI.getSkills(),
        analyticsAPI.getCompanies(),
        analyticsAPI.getApplicationStatus(),
        analyticsAPI.getPackageDistribution()
      ]);

      console.log('Analytics Data:', { stats, departments, skills, companies, applicationStatus, packageDist });

      // Extract data from response (API returns {success: true, data: {...}})
      const statsData = stats.data || stats;
      const deptsData = departments.data || departments;
      const skillsData = skills.data || skills;
      const companiesData = companies.data || companies;
      const packageData = packageDist.data || packageDist;

      // Calculate highest package from jobs
      const highestPkg = companiesData.reduce((max, company) => 
        Math.max(max, company.avg_package || 0), 0
      );

      // Transform the data to match the component's expected structure
      const transformedData = {
        overview: {
          totalStudents: statsData.totalStudents || 0,
          placed: statsData.placedStudents || 0,
          inProcess: statsData.totalApplications - (statsData.placedStudents || 0),
          notPlaced: statsData.totalStudents - (statsData.placedStudents || 0),
          placementRate: statsData.placementRate || 0,
          averagePackage: parseFloat(statsData.averagePackage || 0).toFixed(1),
          highestPackage: parseFloat(highestPkg).toFixed(1),
        },
        departmentStats: deptsData.map(dept => ({
          department: dept.department,
          total: dept.total_students,
          placed: dept.placed_students,
          rate: parseFloat(dept.placement_rate || 0).toFixed(1),
          avgPackage: parseFloat(dept.average_cgpa || 0).toFixed(1)
        })),
        topSkills: skillsData.map(skill => ({
          skill: skill.skill_name,
          demandCount: skill.demand_count || 0,
          students: skill.demand_count || 0,
          gap: 0
        })),
        packageDistribution: packageData || [
          { range: '0-5 LPA', count: 0 },
          { range: '5-10 LPA', count: 0 },
          { range: '10-15 LPA', count: 0 },
          { range: '15-20 LPA', count: 0 },
          { range: '20+ LPA', count: 0 },
        ],
        topCompanies: companiesData.slice(0, 5).map(company => ({
          name: company.name,
          hires: company.placements || 0,
          avgPackage: parseFloat(company.avg_package || 0).toFixed(1)
        })),
        skillGapInsights: skillsData.slice(0, 4).map(skill => ({
          skill: skill.skill_name,
          demand: skill.demand_count || 0,
          supply: skill.demand_count || 0,
          status: 'surplus',
          message: `${skill.demand_count || 0} students have ${skill.skill_name} skills.`
        })),
        trainingRecommendations: [
          {
            category: 'High Priority',
            skills: skillsData.slice(0, 3).map(s => s.skill_name),
            reason: 'Most popular skills among students',
            students: skillsData.slice(0, 3).reduce((sum, s) => sum + (s.demand_count || 0), 0),
          },
          {
            category: 'Medium Priority',
            skills: skillsData.slice(3, 6).map(s => s.skill_name),
            reason: 'Growing skills in student base',
            students: skillsData.slice(3, 6).reduce((sum, s) => sum + (s.demand_count || 0), 0),
          },
          {
            category: 'Emerging Technologies',
            skills: skillsData.filter(s => ['Machine Learning', 'Deep Learning', 'DevOps', 'Blockchain', 'AI', 'Cloud'].includes(s.skill_name)).map(s => s.skill_name).slice(0, 3),
            reason: 'Future-ready skills for premium roles',
            students: skillsData.filter(s => ['Machine Learning', 'Deep Learning', 'DevOps', 'Blockchain', 'AI', 'Cloud'].includes(s.skill_name)).reduce((sum, s) => sum + (s.demand_count || 0), 0),
          },
        ],
      };

      setAnalyticsData(transformedData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="analytics-page">
          <PageHeader title="Placement Analytics" subtitle="Loading analytics data..." />
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="analytics-page">
        <PageHeader
          title="Placement Analytics"
          subtitle="Comprehensive insights into placement trends and skill demand"
          breadcrumbs={[
            { label: 'Home', link: '/' },
            { label: 'Dashboard', link: '/student/dashboard' },
            { label: 'Analytics' }
          ]}
        />

        {/* Tabs */}
        <div className="analytics-tabs">
          <button 
            className={`analytics-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`analytics-tab ${activeTab === 'skills' ? 'active' : ''}`}
            onClick={() => setActiveTab('skills')}
          >
            Skill Analytics
          </button>
          <button 
            className={`analytics-tab ${activeTab === 'departments' ? 'active' : ''}`}
            onClick={() => setActiveTab('departments')}
          >
            Department Stats
          </button>
          <button 
            className={`analytics-tab ${activeTab === 'recommendations' ? 'active' : ''}`}
            onClick={() => setActiveTab('recommendations')}
          >
            Recommendations
          </button>
        </div>

        {/* Tab Content */}
        <div className="analytics-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              {/* Key Metrics */}
              <div className="metrics-grid">
                <div className="metric-card primary">
                  <div className="metric-icon">📊</div>
                  <div className="metric-info">
                    <div className="metric-value">{analyticsData.overview.placementRate}%</div>
                    <div className="metric-label">Placement Rate</div>
                    <div className="metric-sublabel">{analyticsData.overview.placed} of {analyticsData.overview.totalStudents} students</div>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-icon">💰</div>
                  <div className="metric-info">
                    <div className="metric-value">{analyticsData.overview.averagePackage} LPA</div>
                    <div className="metric-label">Average Package</div>
                    <div className="metric-sublabel">Highest: {analyticsData.overview.highestPackage} LPA</div>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-icon">✅</div>
                  <div className="metric-info">
                    <div className="metric-value">{analyticsData.overview.placed}</div>
                    <div className="metric-label">Students Placed</div>
                    <div className="metric-sublabel">{analyticsData.overview.inProcess} in process</div>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-icon">🏢</div>
                  <div className="metric-info">
                    <div className="metric-value">{analyticsData.topCompanies.length}+</div>
                    <div className="metric-label">Partner Companies</div>
                    <div className="metric-sublabel">Active recruiters</div>
                  </div>
                </div>
              </div>

              {/* Package Distribution */}
              <div className="analytics-section">
                <h3>Package Distribution</h3>
                <div className="package-chart">
                  {analyticsData.packageDistribution.map((pkg, index) => (
                    <div key={index} className="package-bar-container">
                      <div className="package-label">{pkg.range}</div>
                      <div className="package-bar-wrapper">
                        <div 
                          className="package-bar"
                          style={{ 
                            width: `${(pkg.count / analyticsData.overview.placed) * 100}%`,
                            background: `hsl(${240 - index * 30}, 70%, 60%)`
                          }}
                        >
                          <span className="package-count">{pkg.count}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Companies */}
              <div className="analytics-section">
                <h3>Top Recruiters</h3>
                <div className="companies-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>Company</th>
                        <th>Hires</th>
                        <th>Avg. Package</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyticsData.topCompanies.map((company, index) => (
                        <tr key={index}>
                          <td className="rank-cell">#{index + 1}</td>
                          <td className="company-cell">{company.name}</td>
                          <td>{company.hires}</td>
                          <td className="package-cell">{company.avgPackage} LPA</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="skills-tab">
              {/* Top Skills in Demand */}
              <div className="analytics-section">
                <h3>Top Skills Required by Companies</h3>
                <p className="section-description">
                  Skills most frequently required in job postings this semester
                </p>
                <div className="skills-demand-list">
                  {analyticsData.topSkills.slice(0, 5).map((skill, index) => (
                    <div key={index} className="skill-demand-card">
                      <div className="skill-rank">#{index + 1}</div>
                      <div className="skill-demand-info">
                        <h4>{skill.skill}</h4>
                        <div className="skill-stats">
                          <span className="stat-item">
                            📊 Required in <strong>{skill.demandCount}</strong> job postings
                          </span>
                          <span className="stat-item">
                            👥 <strong>{skill.students}</strong> students have this skill
                          </span>
                        </div>
                        <div className="skill-gap-indicator">
                          {skill.gap > 0 ? (
                            <span className="gap-surplus">✓ Surplus of {skill.gap} students</span>
                          ) : (
                            <span className="gap-shortage">⚠️ Gap of {Math.abs(skill.gap)} students</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skill Gap Analysis */}
              <div className="analytics-section">
                <h3>Skill Gap Analysis</h3>
                <div className="skill-gap-grid">
                  {analyticsData.skillGapInsights.map((insight, index) => (
                    <div key={index} className={`skill-gap-card ${insight.status}`}>
                      <div className="skill-gap-header">
                        <h4>{insight.skill}</h4>
                        <span className={`status-badge ${insight.status}`}>
                          {insight.status === 'surplus' ? 'Good Coverage' : 'Needs Attention'}
                        </span>
                      </div>
                      <div className="skill-gap-bars">
                        <div className="gap-bar-item">
                          <span className="gap-label">Company Demand</span>
                          <div className="gap-bar">
                            <div 
                              className="gap-bar-fill demand"
                              style={{ width: `${(insight.demand / 50) * 100}%` }}
                            ></div>
                            <span className="gap-value">{insight.demand}</span>
                          </div>
                        </div>
                        <div className="gap-bar-item">
                          <span className="gap-label">Student Supply</span>
                          <div className="gap-bar">
                            <div 
                              className="gap-bar-fill supply"
                              style={{ width: `${(insight.supply / 50) * 100}%` }}
                            ></div>
                            <span className="gap-value">{insight.supply}</span>
                          </div>
                        </div>
                      </div>
                      <p className="skill-gap-message">{insight.message}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* All Skills Overview */}
              <div className="analytics-section">
                <h3>Complete Skills Landscape</h3>
                <div className="skills-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Skill</th>
                        <th>Company Demand</th>
                        <th>Students with Skill</th>
                        <th>Gap Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyticsData.topSkills.map((skill, index) => (
                        <tr key={index}>
                          <td className="skill-name-cell">{skill.skill}</td>
                          <td>{skill.demandCount} roles</td>
                          <td>{skill.students} students</td>
                          <td>
                            {skill.gap > 0 ? (
                              <span className="gap-badge surplus">Surplus</span>
                            ) : (
                              <span className="gap-badge shortage">Gap: {Math.abs(skill.gap)}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'departments' && (
            <div className="departments-tab">
              <div className="analytics-section">
                <h3>Department-wise Placement Statistics</h3>
                <div className="department-cards">
                  {analyticsData.departmentStats.map((dept, index) => (
                    <div key={index} className="department-card">
                      <div className="department-header">
                        <h4>{dept.department}</h4>
                        <span className="placement-rate">{dept.rate}%</span>
                      </div>
                      <div className="department-stats">
                        <div className="stat-row">
                          <span className="stat-label">Total Students:</span>
                          <span className="stat-value">{dept.total}</span>
                        </div>
                        <div className="stat-row">
                          <span className="stat-label">Placed:</span>
                          <span className="stat-value success">{dept.placed}</span>
                        </div>
                        <div className="stat-row">
                          <span className="stat-label">Avg. Package:</span>
                          <span className="stat-value">{dept.avgPackage} LPA</span>
                        </div>
                      </div>
                      <div className="department-progress">
                        <div 
                          className="progress-bar"
                          style={{ 
                            width: `${dept.rate}%`,
                            backgroundColor: dept.rate > 70 ? '#22c55e' : dept.rate > 50 ? '#f59e0b' : '#ef4444'
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Department Comparison Chart */}
              <div className="analytics-section">
                <h3>Department Comparison</h3>
                <div className="comparison-chart">
                  {analyticsData.departmentStats.map((dept, index) => (
                    <div key={index} className="comparison-bar">
                      <div className="comparison-label">{dept.department.split(' ')[0]}</div>
                      <div className="comparison-bar-wrapper">
                        <div 
                          className="comparison-bar-fill"
                          style={{ 
                            width: `${dept.rate}%`,
                            backgroundColor: `hsl(${dept.rate * 1.2}, 70%, 60%)`
                          }}
                        >
                          <span className="comparison-value">{dept.placed}/{dept.total}</span>
                        </div>
                      </div>
                      <div className="comparison-percentage">{dept.rate}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="recommendations-tab">
              <div className="analytics-section">
                <h3>Training & Certification Recommendations</h3>
                <p className="section-description">
                  Based on current market trends and skill gaps
                </p>
                
                {analyticsData.trainingRecommendations.map((rec, index) => (
                  <div key={index} className="recommendation-card">
                    <div className="recommendation-header">
                      <div className="priority-badge" data-priority={rec.category}>
                        {rec.category}
                      </div>
                      <span className="students-affected">
                        {rec.students} students can benefit
                      </span>
                    </div>
                    <div className="recommendation-skills">
                      {rec.skills.map((skill, idx) => (
                        <span key={idx} className="recommended-skill">{skill}</span>
                      ))}
                    </div>
                    <p className="recommendation-reason">
                      <strong>Why:</strong> {rec.reason}
                    </p>
                  </div>
                ))}
              </div>

              {/* Action Items */}
              <div className="analytics-section">
                <h3>Recommended Actions</h3>
                <div className="action-items">
                  <div className="action-item">
                    <div className="action-icon">📚</div>
                    <div className="action-content">
                      <h4>Organize AWS Workshop</h4>
                      <p>20+ job openings require AWS skills. Conduct certification workshop.</p>
                      <button className="btn-action">Schedule Workshop</button>
                    </div>
                  </div>
                  <div className="action-item">
                    <div className="action-icon">💻</div>
                    <div className="action-content">
                      <h4>Advanced JavaScript Bootcamp</h4>
                      <p>Most demanded skill with 42 job postings. Organize intensive training.</p>
                      <button className="btn-action">Plan Bootcamp</button>
                    </div>
                  </div>
                  <div className="action-item">
                    <div className="action-icon">🎯</div>
                    <div className="action-content">
                      <h4>System Design Sessions</h4>
                      <p>Premium roles require system design knowledge. Start weekly sessions.</p>
                      <button className="btn-action">Start Sessions</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;