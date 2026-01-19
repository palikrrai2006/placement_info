import React from 'react';
import './DashboardCard.css';

const DashboardCard = ({ 
  title, 
  value, 
  icon, 
  subtitle, 
  trend, 
  bgColor = '#ffffff',
  onClick 
}) => {
  return (
    <div 
      className={`dashboard-card ${onClick ? 'clickable' : ''}`}
      style={{ backgroundColor: bgColor }}
      onClick={onClick}
    >
      <div className="card-content">
        <div className="card-header">
          <h3 className="card-title">{title}</h3>
          {icon && <span className="card-icon">{icon}</span>}
        </div>
        <div className="card-value">{value}</div>
        {subtitle && <p className="card-subtitle">{subtitle}</p>}
        {trend && (
          <div className={`card-trend ${trend.type}`}>
            <span className="trend-icon">{trend.type === 'up' ? '↑' : '↓'}</span>
            <span>{trend.value}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardCard;
