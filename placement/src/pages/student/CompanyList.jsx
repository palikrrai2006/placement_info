import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import PageHeader from '../../components/PageHeader';
import { companiesAPI } from '../../services/api';
import './CompanyList.css';

const CompanyList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSector, setFilterSector] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const result = await companiesAPI.getAll();
        if (result.success) {
          setCompanies(result.data);
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const mockCompanies = [
    {
      id: 1,
      name: 'Tech Corp',
      logo: '🏢',
      sector: 'Technology',
      locations: ['Bangalore', 'Hyderabad'],
      activeOpenings: 5,
      package: '12-15 LPA',
      status: 'hiring',
      visitDate: '2025-12-05',
      description: 'Leading technology solutions provider',
    },
    {
      id: 2,
      name: 'Innovation Labs',
      logo: '💡',
      sector: 'Software',
      locations: ['Pune', 'Mumbai'],
      activeOpenings: 3,
      package: '10-14 LPA',
      status: 'hiring',
      visitDate: '2025-12-10',
      description: 'Innovation-driven software company',
    },
    {
      id: 3,
      name: 'Data Analytics Co',
      logo: '📊',
      sector: 'Analytics',
      locations: ['Bangalore', 'Delhi'],
      activeOpenings: 4,
      package: '11-13 LPA',
      status: 'hiring',
      visitDate: '2025-12-15',
      description: 'Data science and analytics specialists',
    },
    {
      id: 4,
      name: 'Cloud Systems Inc',
      logo: '☁️',
      sector: 'Cloud Computing',
      locations: ['Bangalore'],
      activeOpenings: 2,
      package: '15-18 LPA',
      status: 'upcoming',
      visitDate: '2025-12-20',
      description: 'Cloud infrastructure solutions',
    },
    {
      id: 5,
      name: 'AI Solutions',
      logo: '🤖',
      sector: 'Artificial Intelligence',
      locations: ['Bangalore', 'Pune', 'Hyderabad'],
      activeOpenings: 6,
      package: '14-17 LPA',
      status: 'hiring',
      visitDate: '2025-12-08',
      description: 'AI and ML product company',
    },
    {
      id: 6,
      name: 'Finance Tech',
      logo: '💰',
      sector: 'Fintech',
      locations: ['Mumbai', 'Bangalore'],
      activeOpenings: 0,
      package: '13-16 LPA',
      status: 'closed',
      visitDate: '2025-11-20',
      description: 'Financial technology solutions',
    },
  ];

  const sectors = ['all', 'Technology', 'Software', 'Analytics', 'Cloud Computing', 'Artificial Intelligence', 'Fintech'];
  const statuses = ['all', 'hiring', 'upcoming', 'closed'];

  const filteredCompanies = loading ? [] : companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (company.description && company.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSector = filterSector === 'all' || company.industry === filterSector;
    const matchesStatus = filterStatus === 'all' || (filterStatus === 'hiring' && company.job_count > 0) || (filterStatus === 'closed' && company.job_count === 0);
    return matchesSearch && matchesSector && matchesStatus;
  });

  const getStatusBadge = (jobCount) => {
    if (jobCount > 0) {
      return <span className="status-badge" style={{ backgroundColor: '#dcfce7', color: '#166534' }}>Hiring</span>;
    }
    return <span className="status-badge" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>No Openings</span>;
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading-state">Loading companies...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="company-list-page">
        <PageHeader
          title="Companies"
          subtitle="Explore companies visiting for placement"
          breadcrumbs={[
            { label: 'Home', link: '/' },
            { label: 'Dashboard', link: '/student/dashboard' },
            { label: 'Companies' }
          ]}
        />

        {/* Filters */}
        <div className="filters-section">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <select value={filterSector} onChange={(e) => setFilterSector(e.target.value)}>
              {sectors.map(sector => (
                <option key={sector} value={sector}>
                  {sector === 'all' ? 'All Sectors' : sector}
                </option>
              ))}
            </select>

            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="results-info">
          <p>Showing {filteredCompanies.length} {filteredCompanies.length === 1 ? 'company' : 'companies'}</p>
        </div>

        {/* Companies Grid */}
        <div className="companies-grid">
          {filteredCompanies.length > 0 ? (
            filteredCompanies.map(company => (
              <Link key={company.id} to={`/student/companies/${company.id}`} className="company-card">
                <div className="company-header">
                  <div className="company-logo">{company.logo}</div>
                  {getStatusBadge(company.job_count)}
                </div>

                <h3 className="company-name">{company.name}</h3>
                <p className="company-sector">{company.industry || 'Technology'}</p>
                <p className="company-description">{company.description || 'No description available'}</p>

                <div className="company-info">
                  <div className="info-item">
                    <span className="info-icon">📍</span>
                    <span>{company.location || 'Multiple locations'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-icon">📞</span>
                    <span>{company.contact_email || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-icon">🌐</span>
                    <span>{company.website || 'N/A'}</span>
                  </div>
                </div>

                <div className="company-footer">
                  <span className="openings-count">
                    {company.job_count > 0 
                      ? `${company.job_count} Active ${company.job_count === 1 ? 'Opening' : 'Openings'}`
                      : 'No Active Openings'}
                  </span>
                  <span className="view-details-arrow">→</span>
                </div>
              </Link>
            ))
          ) : (
            <div className="empty-state">
              <p>No companies found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CompanyList;
