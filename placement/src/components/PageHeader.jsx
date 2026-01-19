import React from 'react';
import './PageHeader.css';

const PageHeader = ({ 
  title, 
  subtitle, 
  actions, 
  breadcrumbs 
}) => {
  return (
    <div className="page-header">
      {breadcrumbs && (
        <nav className="breadcrumbs">
          {breadcrumbs.map((crumb, index) => (
            <span key={index}>
              {crumb.link ? (
                <a href={crumb.link} className="breadcrumb-link">
                  {crumb.label}
                </a>
              ) : (
                <span className="breadcrumb-current">{crumb.label}</span>
              )}
              {index < breadcrumbs.length - 1 && <span className="breadcrumb-separator">/</span>}
            </span>
          ))}
        </nav>
      )}
      
      <div className="header-content">
        <div className="header-text">
          <h1 className="page-title">{title}</h1>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>
        
        {actions && (
          <div className="header-actions">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
