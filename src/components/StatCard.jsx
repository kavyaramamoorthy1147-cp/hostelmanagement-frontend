import React from 'react';

const StatCard = ({ title, value, icon: Icon, colorTheme = 'blue' }) => {
  return (
    <div className="stat-card">
      <div>
        <div className="stat-info-title">{title}</div>
        <div className="stat-info-value">{value}</div>
      </div>
      {Icon && (
        <div className={`stat-icon-wrapper stat-icon-${colorTheme}`}>
          <Icon size={24} />
        </div>
      )}
    </div>
  );
};

export default StatCard;
